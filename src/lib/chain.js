import { createPublicClient, http, isAddress } from 'viem'
import { robinhood } from 'viem/chains'

function addr(value) {
  const next = String(value || '').trim()
  return isAddress(next) ? next : ''
}

function intEnv(value, fallback = 0n) {
  const next = String(value || '').trim()
  if (!next) return fallback
  try {
    return BigInt(next)
  } catch {
    return fallback
  }
}

export const chain = robinhood
export const explorer = chain.blockExplorers.default.url

export const addresses = {
  apro: addr(import.meta.env.VITE_APRO_ADDRESS || import.meta.env.VITE_APERO_ADDRESS),
  weth: addr(import.meta.env.VITE_WETH_ADDRESS),
  flame: addr(import.meta.env.VITE_FLAME_ADDRESS),
  treasury: addr(import.meta.env.VITE_TREASURY_ADDRESS),
  pool: addr(import.meta.env.VITE_POOL_ADDRESS),
}

export const deadAddress = '0x000000000000000000000000000000000000dEaD'
export const startBlock = intEnv(import.meta.env.VITE_START_BLOCK, 0n)

export const live = {
  flame: Boolean(addresses.flame && addresses.apro),
  dashboard: Boolean(addresses.apro || addresses.treasury || addresses.pool),
}

export const publicClient = createPublicClient({
  chain,
  transport: http(import.meta.env.VITE_RPC_URL || undefined),
})

export function txUrl(hash) {
  return `${explorer}/tx/${hash}`
}

export function addressUrl(value) {
  return `${explorer}/address/${value}`
}
