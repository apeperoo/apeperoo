import { createWalletClient, custom, maxUint256 } from 'viem'
import { erc20Abi } from './abi'
import { addresses, chain, publicClient } from './chain'

export async function walletClientFor(wallet) {
  if (!wallet) throw new Error('Connect a wallet first')
  if (wallet.switchChain) {
    try {
      await wallet.switchChain(chain.id)
    } catch {
      // Wallet may already be on Robinhood Chain, or the user dismissed the switch.
    }
  }
  const provider = await wallet.getEthereumProvider()
  return createWalletClient({
    account: wallet.address,
    chain,
    transport: custom(provider),
  })
}

export async function writeFn({ wallet, address, abi, functionName, args = [] }) {
  const walletClient = await walletClientFor(wallet)
  const hash = await walletClient.writeContract({
    address,
    abi,
    functionName,
    args,
    account: wallet.address,
    chain,
  })
  return publicClient.waitForTransactionReceipt({ hash })
}

export async function ensureAllowance({ wallet, owner, spender, amount }) {
  if (!addresses.apro) throw new Error('APRO address is missing')
  const allowance = await publicClient.readContract({
    address: addresses.apro,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [owner, spender],
  })
  if (allowance >= amount) return
  await writeFn({
    wallet,
    address: addresses.apro,
    abi: erc20Abi,
    functionName: 'approve',
    args: [spender, maxUint256],
  })
}
