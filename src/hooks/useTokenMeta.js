import { useEffect, useState } from 'react'
import { erc20Abi } from '../lib/abi'
import { addresses, deadAddress, publicClient } from '../lib/chain'

const fallback = { decimals: 18, symbol: 'APRO', supply: null }

export default function useTokenMeta() {
  const [meta, setMeta] = useState(fallback)

  useEffect(() => {
    if (!addresses.apro) return undefined

    let cancelled = false
    Promise.all([
      publicClient.readContract({ address: addresses.apro, abi: erc20Abi, functionName: 'decimals' }),
      publicClient.readContract({ address: addresses.apro, abi: erc20Abi, functionName: 'symbol' }),
      publicClient.readContract({ address: addresses.apro, abi: erc20Abi, functionName: 'totalSupply' }),
      publicClient.readContract({
        address: addresses.apro,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [deadAddress],
      }),
    ])
      .then(([decimals, symbol, supply, burned]) => {
        if (!cancelled) setMeta({ decimals: Number(decimals), symbol, supply: supply - burned })
      })
      .catch(() => {
        if (!cancelled) setMeta(fallback)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return meta
}
