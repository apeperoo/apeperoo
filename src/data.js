export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Opportunity', to: '/opportunity' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Flame', to: '/flame' },
  { label: 'Dashboard', to: '/dashboard' },
]

export const SOCIAL_X = 'https://x.com/Apeperoo'

export const TICKER = 'Apeperoo is launching on Robinhood Chain via Pons under the token symbol APRO'

export const PROPOSITIONS = [
  {
    id: 'project',
    kicker: 'Project',
    title: 'An ETH treasury on Robinhood Chain',
    body: 'APRO launches on Pons with locked WETH liquidity. The treasury holds ETH in public. The score is ETH per remaining token.',
  },
  {
    id: 'operations',
    kicker: 'Treasury',
    title: 'ETH you can see',
    body: 'Treasury ETH sits onchain. A 3% trading fee lands in the treasury. Flame pots are funded from that book, in public.',
  },
  {
    id: 'equity',
    kicker: 'Token',
    title: 'Launch on Pons',
    body: 'One wallet signed deploy on Robinhood Chain. Locked WETH pool from the first trade. Then the treasury compounds instead of printing more tokens.',
  },
  {
    id: 'flame',
    kicker: 'Utility',
    title: 'Flame, the onchain burn game',
    body: 'Burn APRO to join Flame. The last wallet to burn when the 10 minute clock ends takes the ETH pot. Every accepted burn is destroyed, so ETH per remaining token rises.',
  },
  {
    id: 'transparency',
    kicker: 'Dashboard',
    title: 'Numbers in public',
    body: 'The dashboard tracks treasury ETH and Flame burns as they move. If it is not onchain, it is not the score.',
  },
]

export const PRODUCTIVITY = [
  {
    n: '01',
    title: 'Launched on Pons',
    body: 'APRO goes live on Robinhood Chain through Pons. You sign from your wallet. Liquidity locks in the pool from the first trade.',
  },
  {
    n: '02',
    title: 'ETH paired from day one',
    body: 'The token trades against WETH. A 3% fee goes to the treasury. From there, ETH can be sent to Flame as the pot.',
  },
  {
    n: '03',
    title: 'Trackable day by day',
    body: 'Holdings, rewards, and ETH per token land on the dashboard so you can see the stack as it moves.',
  },
]

export const OPPORTUNITY_POINTS = [
  {
    title: 'Robinhood Chain is a new market',
    body: 'A fast EVM chain puts permissionless launches in front of a huge retail crowd. Markets form in public. ETH is the pair.',
  },
  {
    title: 'Pons locks the liquidity',
    body: 'Pons deploys a fixed supply token and a locked WETH pool in one wallet signed transaction. No hidden unlock. Trading starts where the liquidity lives.',
  },
  {
    title: 'ETH is the reserve',
    body: 'WETH is the quote on Pons. A 3% trading fee goes to the public treasury. Flame prizes are sent from that treasury, not minted.',
  },
  {
    title: 'Burns do the work',
    body: 'Flame destroys APRO. Fewer tokens sit in front of the same ETH treasury, so ETH per remaining token rises.',
  },
]

export const FAQS = [
  {
    q: 'Where does Apeperoo launch?',
    a: 'APRO is launching on Robinhood Chain via Pons. You sign the deploy from your wallet. It is not a listing on the Robinhood brokerage app, not Robinhood stock, and not affiliated with Robinhood Markets. We do not provide investment advice.',
  },
  {
    q: 'What is Pons?',
    a: 'Pons is a permissionless launchpad on Robinhood Chain. Creators deploy a fixed supply token and a locked WETH pool in a single wallet signed transaction. Apeperoo uses Pons as the launch rail. PONS is the launchpad’s own token, not ours.',
  },
  {
    q: 'What is the treasury?',
    a: 'The treasury is ETH held in public next to the APRO pool. A 3% trading fee goes there. The score is ETH behind each remaining token. Holdings and Flame burns show on the dashboard.',
  },
  {
    q: 'How is Apeperoo different from a typical Pons meme launch?',
    a: 'Most launches stop at the pool. Apeperoo keeps an ETH treasury and burns APRO in Flame. The brand is ape. The books stay onchain.',
  },
  {
    q: 'What does it mean to grow ETH per token?',
    a: 'Burns cut APRO supply. Treasury ETH sits behind fewer tokens. The point is more ETH per remaining APRO, not a higher token price by itself.',
  },
  {
    q: 'What is Flame?',
    a: 'Flame is Apeperoo’s burn lottery. Burn the exact APRO quote to join the round. Each burn raises the next quote by 5% and destroys those tokens. When the 10 minute clock ends, the last wallet that burned takes the full ETH pot. The pot is ETH sent from the treasury, not a per-trade drip.',
  },
  {
    q: 'Where does the 3% fee go?',
    a: 'Trading fee is 3% and it lands in the public treasury. Flame rewards are funded from that treasury when ETH is sent to the Flame contract. Nothing is printed to pay the pot.',
  },
  {
    q: 'Is Apeperoo a memecoin?',
    a: 'Apeperoo launches with ape energy on Pons. ETH is the reserve. APRO is the claim on a public treasury, plus Flame.',
  },
  {
    q: 'Where can I learn more or follow updates?',
    a: 'Read this FAQ, then the Flame and Dashboard pages. Updates land on X at Apeperoo.',
  },
]

export const DASHBOARD_METRICS = [
  {
    id: 'apro',
    label: 'APRO Price',
    hint: 'Token price. Preview numbers until the pool is live.',
  },
  {
    id: 'eth',
    label: 'ETH Price',
    hint: 'The current market price of one ETH. Pons pairs launch tokens against WETH.',
  },
  {
    id: 'volume',
    label: 'Avg Daily Volume (30D)',
    hint: 'Average trading volume of APRO over the last 30 days.',
  },
  {
    id: 'mcap',
    label: 'Market Cap',
    hint: 'Circulating supply multiplied by the latest APRO price.',
  },
  {
    id: 'holdings',
    label: 'Total ETH Holdings',
    hint: 'ETH held in the Apeperoo treasury.',
  },
  {
    id: 'rewards',
    label: 'ETH earned',
    hint: 'ETH moved by the treasury. Preview until live addresses are set.',
  },
  {
    id: 'concentration',
    label: 'ETH per 1,000 tokens',
    hint: 'Treasury ETH divided by each 1,000 APRO outstanding.',
  },
  {
    id: 'ethNav',
    label: 'Treasury in USD',
    hint: 'Treasury ETH multiplied by the current ETH price.',
  },
  {
    id: 'nav',
    label: 'Treasury value',
    hint: 'Treasury ETH in dollars. Live reads are ETH and WETH only.',
  },
  {
    id: 'navShare',
    label: 'Value per token',
    hint: 'Treasury value divided by APRO outstanding.',
  },
  {
    id: 'mnav',
    label: 'Market vs treasury',
    hint: 'Market cap divided by treasury value.',
  },
  {
    id: 'fdMnav',
    label: 'Fully diluted vs treasury',
    hint: 'Fully diluted market cap divided by treasury value.',
  },
]

export const FLAME_START_BURN = 100000
export const FLAME_START_SUPPLY = 42_000_000

export const FLAME_HISTORY = [
  {
    round: 1,
    address: '0x8f2a91c41d7e4b2a91c0d3e8f1a2b3c4d5e6f708',
    burn: 100000,
    atMs: 48 * 1000,
    hash: '0x91aae02c4b17d8e3a6f0c1d2e3f405162738495a6b7c8d9e0f1a2b3c4d5e6f70',
  },
  {
    round: 1,
    address: '0xb17c90e41a2d3c4e5f60718293a4b5c6d7e8f901',
    burn: 105000,
    atMs: 132 * 1000,
    hash: '0x33d1a7b82c4e5f60718293a4b5c6d7e8f901a2b3c4d5e6f708192a3b4c5d6e7f',
  },
  {
    round: 1,
    address: '0x4e0912af3b4c5d6e7f8091a2b3c4d5e6f708192a',
    burn: 110250,
    atMs: 221 * 1000,
    hash: '0x70c419de5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f80',
  },
  {
    round: 1,
    address: '0xc81d44b15e6f708192a3b4c5d6e7f8091a2b3c4d',
    burn: 115763,
    atMs: 318 * 1000,
    hash: '0xa4b8c21f6d7e8f901a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f7081',
  },
  {
    round: 1,
    address: '0x6a11e9c02d3e4f5061728394a5b6c7d8e9f0a1b2',
    burn: 121551,
    atMs: 404 * 1000,
    hash: '0xe19c60b47f8091a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a',
  },
]
