import { PrivyProvider } from '@privy-io/react-auth'
import { robinhood } from 'viem/chains'

export const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || ''
const CLIENT_ID = import.meta.env.VITE_PRIVY_CLIENT_ID || ''

const config = {
  appearance: {
    theme: 'dark',
    accentColor: '#00C805',
    logo: '/favicon.svg',
    landingHeader: 'Connect to Apeperoo',
    loginMessage: 'Flame uses Robinhood Chain. Not affiliated with Robinhood Markets.',
    showWalletLoginFirst: true,
    walletChainType: 'ethereum-only',
    walletList: [
      'detected_ethereum_wallets',
      'metamask',
      'robinhood_wallet',
      'coinbase_wallet',
      'rainbow',
      'wallet_connect',
    ],
  },
  defaultChain: robinhood,
  supportedChains: [robinhood],
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets',
    },
  },
}

export default function PrivyApp({ children }) {
  if (!PRIVY_APP_ID) return children

  return (
    <PrivyProvider appId={PRIVY_APP_ID} clientId={CLIENT_ID || undefined} config={config}>
      {children}
    </PrivyProvider>
  )
}
