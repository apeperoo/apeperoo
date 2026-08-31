import { useEffect, useState } from 'react'
import { erc20Abi, pairAbi } from '../lib/abi'
import { addresses, live, publicClient } from '../lib/chain'
import { fromUnits } from '../lib/format'
import useTokenMeta from './useTokenMeta'

const empty = {
  supply: null,
  holdings: null,
  rewards: null,
  price: null,
}

export default function useTreasury() {
  const token = useTokenMeta()
  const [state, setState] = useState({ loading: live.dashboard, ...empty })

  useEffect(() => {
    if (!live.dashboard) return undefined

    let dead = false

    async function load() {
      try {
        let holdings = null
        if (addresses.treasury) {
          const [ethBal, wethBal] = await Promise.all([
            publicClient.getBalance({ address: addresses.treasury }),
            addresses.weth
              ? publicClient.readContract({
                  address: addresses.weth,
                  abi: erc20Abi,
                  functionName: 'balanceOf',
                  args: [addresses.treasury],
                })
              : Promise.resolve(0n),
          ])
          holdings = fromUnits(ethBal + wethBal, 18, 4)
        }

        let price = null
        if (addresses.pool && addresses.apro && addresses.weth) {
          const [token0, reserves] = await Promise.all([
            publicClient.readContract({ address: addresses.pool, abi: pairAbi, functionName: 'token0' }),
            publicClient.readContract({ address: addresses.pool, abi: pairAbi, functionName: 'getReserves' }),
          ])
          const aproIs0 = token0.toLowerCase() === addresses.apro.toLowerCase()
          const aproRes = aproIs0 ? reserves[0] : reserves[1]
          const wethRes = aproIs0 ? reserves[1] : reserves[0]
          if (aproRes > 0n) {
            price = fromUnits((wethRes * 10n ** BigInt(token.decimals)) / aproRes, 18, 6)
          }
        }

        if (!dead) {
          setState({
            loading: false,
            supply: token.supply != null ? fromUnits(token.supply, token.decimals, 0) : null,
            holdings,
            rewards: null,
            price,
          })
        }
      } catch {
        if (!dead) setState((prev) => ({ ...prev, loading: false }))
      }
    }

    load()
    const id = window.setInterval(load, 20_000)
    return () => {
      dead = true
      window.clearInterval(id)
    }
  }, [token.decimals, token.supply])

  return { live: live.dashboard, token, ...state }
}
