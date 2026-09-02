import { useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import useFlame from '../hooks/useFlame'
import { flameAbi } from '../lib/abi'
import { addresses, live } from '../lib/chain'
import { fromUnits, shorten, txError } from '../lib/format'
import { ensureAllowance, writeFn } from '../lib/tx'
import { PRIVY_APP_ID } from '../providers/PrivyApp'
import Button from './Button'

function sessionNote(authenticated) {
  if (live.flame) return authenticated ? '' : 'Robinhood Chain · contracts ready'
  return authenticated ? 'Signed in · contracts not live' : 'Preview interface · contracts not live'
}

function WalletButtonLive({ compact, onDark, className, connectLabel, icon }) {
  const { ready, authenticated, login, logout, user } = usePrivy()
  const { wallets } = useWallets()
  const address = wallets[0]?.address || user?.wallet?.address
  const label = authenticated ? shorten(address) || 'Connected' : connectLabel
  const waiting = !ready

  return (
    <Button
      className={className}
      variant={authenticated ? 'secondary' : 'accent'}
      onDark={onDark}
      icon={icon && !authenticated}
      disabled={waiting}
      onClick={authenticated ? logout : login}
    >
      {waiting ? '…' : compact && authenticated ? label : authenticated ? `Disconnect ${label}` : label}
    </Button>
  )
}

export default function WalletButton({
  compact = false,
  onDark = false,
  className = '',
  connectLabel = 'Connect wallet',
  icon = false,
}) {
  if (!PRIVY_APP_ID) {
    return (
      <Button className={className} variant="accent" onDark={onDark} icon={icon} disabled>
        {connectLabel}
      </Button>
    )
  }

  return (
    <WalletButtonLive
      compact={compact}
      onDark={onDark}
      className={className}
      connectLabel={connectLabel}
      icon={icon}
    />
  )
}

export function FlameConnect({ snap, decimals = 18, onDone }) {
  if (!PRIVY_APP_ID) {
    return (
      <div className="flame-cta">
        <Button variant="accent" icon disabled>
          Connect wallet to burn
        </Button>
        <p className="mono">Add VITE_PRIVY_APP_ID in .env.local to enable Privy</p>
      </div>
    )
  }

  return <FlameConnectLive snap={snap} decimals={decimals} onDone={onDone} />
}

function FlameConnectLive({ snap, decimals, onDone }) {
  const { ready, authenticated, login, logout, user } = usePrivy()
  const { wallets } = useWallets()
  const address = wallets[0]?.address || user?.wallet?.address
  const wallet =
    wallets.find((row) => row.address?.toLowerCase() === String(address || '').toLowerCase()) ||
    wallets[0]
  const flame = useFlame(address)
  const account = flame.account
  const required = (snap?.required && snap.required > 0n ? snap.required : flame.snap.required) || 0n
  const expired = Boolean(
    (snap?.required && snap.required > 0n ? snap.expired : flame.snap.expired) ?? false,
  )
  const round = snap?.round && snap.round > 0n ? snap.round : flame.snap.round
  const [busy, setBusy] = useState('')
  const [note, setNote] = useState('')

  async function run(label, fn) {
    setNote('')
    setBusy(label)
    try {
      await fn()
      setNote('Confirmed')
      await flame.refresh()
      await onDone?.()
    } catch (err) {
      setNote(txError(err))
    } finally {
      setBusy('')
    }
  }

  if (!ready) {
    return (
      <div className="flame-cta">
        <Button variant="accent" icon disabled>
          Connecting
        </Button>
        <p className="mono">Checking session</p>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flame-cta">
        <Button variant="accent" icon onClick={login}>
          Connect wallet to burn
        </Button>
        <p className="mono">{sessionNote(false)}</p>
      </div>
    )
  }

  const canWrite = live.flame && wallet
  const canBurn = canWrite && !expired && required > 0n
  const canFinalize = canWrite && expired && flame.snap.endsAt > 0n
  const canClaim = canWrite && account?.claimable > 0n
  const claimId = account?.claimId || (round > 1n ? round - 1n : 0n)

  return (
    <div className="flame-cta">
      <p className="mono">Signed in · {shorten(address)}</p>
      {canBurn ? (
        <Button
          variant="accent"
          disabled={Boolean(busy)}
          onClick={() =>
            run('Burning', async () => {
              await ensureAllowance({
                wallet,
                owner: address,
                spender: addresses.flame,
                amount: required,
              })
              await writeFn({
                wallet,
                address: addresses.flame,
                abi: flameAbi,
                functionName: 'takeLead',
              })
            })
          }
        >
          {busy === 'Burning' ? 'Burning' : `Burn ${fromUnits(required, decimals, 0).toLocaleString('en-US')} APRO`}
        </Button>
      ) : (
        <Button variant="accent" disabled>
          {busy ||
            (!live.flame
              ? 'Burn is not live'
              : !wallet
                ? 'Wallet not ready'
                : flame.error || required === 0n
                  ? 'Flame not onchain'
                  : expired
                    ? 'Round ended'
                    : 'Burn unavailable')}
        </Button>
      )}
      {canFinalize && (
        <Button
          variant="secondary"
          disabled={Boolean(busy)}
          onClick={() =>
            run('Finalizing', () =>
              writeFn({
                wallet,
                address: addresses.flame,
                abi: flameAbi,
                functionName: 'finalize',
              }),
            )
          }
        >
          {busy === 'Finalizing' ? 'Finalizing' : 'Finalize round'}
        </Button>
      )}
      {canClaim && (
        <Button
          variant="secondary"
          disabled={Boolean(busy)}
          onClick={() =>
            run('Claiming', () =>
              writeFn({
                wallet,
                address: addresses.flame,
                abi: flameAbi,
                functionName: 'claim',
                args: [claimId],
              }),
            )
          }
        >
          {busy === 'Claiming' ? 'Claiming' : 'Claim the pot'}
        </Button>
      )}
      <Button variant="secondary" onClick={logout}>
        Disconnect
      </Button>
      <p className="mono">{note || sessionNote(true)}</p>
    </div>
  )
}

export function FlameTimeCard({ live }) {
  if (!PRIVY_APP_ID || !live) {
    return (
      <article className="flame-card">
        <p className="mono">Your ticket</p>
        <p className="h4">Open</p>
        <p className="body-smaller">Burn APRO to become the last burn</p>
      </article>
    )
  }
  return <FlameTimeCardLive />
}

function FlameTimeCardLive() {
  const { user } = usePrivy()
  const { wallets } = useWallets()
  const flame = useFlame(wallets[0]?.address || user?.wallet?.address)
  const last = flame.account.lastBurn
  const claimable = fromUnits(flame.account.claimable, 18, 4)

  return (
    <article className="flame-card">
      <p className="mono">Your ticket</p>
      <p className="h4">{last ? 'Last burn' : claimable > 0 ? `${claimable} ETH` : 'Open'}</p>
      <p className="body-smaller">
        {last
          ? 'Hold until the clock hits zero to take the pot'
          : claimable > 0
            ? 'Last round pot is ready to claim'
            : 'Burn APRO to become the last burn'}
      </p>
    </article>
  )
}

export function FlameYourBurns({ rows }) {
  if (!PRIVY_APP_ID) return null
  return <FlameYourBurnsLive rows={rows} />
}

function FlameYourBurnsLive({ rows }) {
  const { ready, authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  const address = (wallets[0]?.address || user?.wallet?.address || '').toLowerCase()

  if (!ready || !authenticated || !address) return null

  const mine = rows.filter((row) => row.address.toLowerCase() === address)
  const destroyed = mine.reduce((sum, row) => sum + row.burn, 0)

  return (
    <div className="flame-your-burns">
      <p className="mono">Your burns this round</p>
      {mine.length === 0 ? (
        <p className="body-smaller">No burns from {shorten(address)} yet.</p>
      ) : (
        <p className="body-smaller">
          {mine.length} burn{mine.length === 1 ? '' : 's'} · {destroyed.toLocaleString('en-US')} APRO destroyed
        </p>
      )}
    </div>
  )
}
