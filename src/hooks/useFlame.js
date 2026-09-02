import { useCallback, useEffect, useState } from 'react'
import { flameAbi, leadTakenEvent } from '../lib/abi'
import { addresses, live, publicClient, startBlock } from '../lib/chain'
import { fromUnits } from '../lib/format'
import useTokenMeta from './useTokenMeta'

const emptySnap = {
  round: 1n,
  endsAt: 0n,
  required: 0n,
  currentLeader: '',
  prize: 0n,
  upcoming: 0n,
  burned: 0n,
  expired: false,
}

const emptyAccount = {
  lastBurn: false,
  claimable: 0n,
  claimId: 0n,
}

export default function useFlame(userAddress) {
  const token = useTokenMeta()
  const [state, setState] = useState({
    loading: live.flame,
    error: '',
    snap: emptySnap,
    account: emptyAccount,
    history: [],
  })

  const load = useCallback(async () => {
    if (!live.flame) return

    try {
      const [round, endsAt, required, currentLeader, prize, upcoming, burned, expired] =
        await publicClient.readContract({
          address: addresses.flame,
          abi: flameAbi,
          functionName: 'snapshot',
        })

      let account = emptyAccount
      if (userAddress) {
        const [lastBurn] = await publicClient.readContract({
          address: addresses.flame,
          abi: flameAbi,
          functionName: 'account',
          args: [userAddress],
        })

        let claimable = 0n
        let claimId = 0n
        const lookback = round > 8n ? 8n : round > 1n ? round - 1n : 0n
        if (lookback > 0n) {
          const start = round - lookback
          const ids = []
          for (let id = start; id < round; id += 1n) ids.push(id)
          const rows = await Promise.all(
            ids.map((id) =>
              Promise.all([
                publicClient.readContract({
                  address: addresses.flame,
                  abi: flameAbi,
                  functionName: 'winner',
                  args: [id],
                }),
                publicClient.readContract({
                  address: addresses.flame,
                  abi: flameAbi,
                  functionName: 'pot',
                  args: [id],
                }),
                publicClient.readContract({
                  address: addresses.flame,
                  abi: flameAbi,
                  functionName: 'claimed',
                  args: [id],
                }),
              ]).then(([winner, pot, claimed]) => ({ id, winner, pot, claimed })),
            ),
          )
          for (const row of rows) {
            if (
              row.winner.toLowerCase() === userAddress.toLowerCase() &&
              !row.claimed &&
              row.pot > 0n
            ) {
              claimable += row.pot
              if (claimId === 0n) claimId = row.id
            }
          }
        }
        account = { lastBurn, claimable, claimId }
      }

      let history = []
      try {
        const logs = await publicClient.getLogs({
          address: addresses.flame,
          event: leadTakenEvent,
          fromBlock: startBlock > 0n ? startBlock : undefined,
          toBlock: 'latest',
        })
        history = logs.map((log) => ({
          round: Number(log.args.roundId),
          address: log.args.leader,
          burn: fromUnits(log.args.amount, token.decimals, 0),
          burnRaw: log.args.amount,
          atMs: Number(log.args.at) * 1000,
          hash: log.transactionHash,
          endsAt: Number(log.args.endsAt) * 1000,
        }))
      } catch {
        history = []
      }

      setState({
        loading: false,
        error: '',
        snap: { round, endsAt, required, currentLeader, prize, upcoming, burned, expired },
        account,
        history,
      })
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: 'unreachable' }))
    }
  }, [token.decimals, userAddress])

  useEffect(() => {
    if (!live.flame) return undefined
    load()
    const id = window.setInterval(load, 12_000)
    return () => window.clearInterval(id)
  }, [load])

  return { live: live.flame, token, refresh: load, ...state }
}
