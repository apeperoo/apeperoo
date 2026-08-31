import { parseAbi, parseAbiItem } from 'viem'

export const erc20Abi = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
])

export const pairAbi = parseAbi([
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
])

export const flameAbi = parseAbi([
  'function takeLead()',
  'function finalize()',
  'function fund() payable',
  'function claim(uint256 id)',
  'function roundId() view returns (uint256)',
  'function snapshot() view returns (uint256 round, uint256 endsAt, uint256 required, address currentLeader, uint256 prize, uint256 upcoming, uint256 burned, bool expired)',
  'function account(address user) view returns (bool lastBurn, uint256 claimable)',
  'function winner(uint256 id) view returns (address)',
  'function pot(uint256 id) view returns (uint256)',
  'function claimed(uint256 id) view returns (bool)',
])

export const leadTakenEvent = parseAbiItem(
  'event LeadTaken(uint256 indexed roundId, address indexed leader, uint256 amount, uint256 nextRequired, uint256 endsAt, uint256 at)',
)
