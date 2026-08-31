import { useMemo } from 'react'
import FAQ from '../components/FAQ'
import { FlameConnect, FlameTimeCard, FlameYourBurns } from '../components/WalletButton'
import { FLAME_HISTORY, FLAME_START_BURN, FLAME_START_SUPPLY } from '../data'
import useFlame from '../hooks/useFlame'
import useNow from '../hooks/useNow'
import { txUrl } from '../lib/chain'
import { clock, fromUnits, isZeroAddress, shorten, wall } from '../lib/format'

const ROUND_MS = 10 * 60 * 1000
const FLOOR_MS = 60 * 1000

export default function Flame() {
  const opened = useMemo(() => Date.now() - (FLAME_HISTORY.at(-1).atMs + 90_000), [])
  const now = useNow()
  const flame = useFlame()
  const decimals = flame.token.decimals

  const previewLeader = FLAME_HISTORY[FLAME_HISTORY.length - 1]
  const previewBurned = FLAME_HISTORY.reduce((sum, row) => sum + row.burn, 0)
  const previewNext = Math.round(FLAME_START_BURN * 1.05 ** FLAME_HISTORY.length)
  const previewLeft = Math.max(0, opened + ROUND_MS - now)

  const live = flame.live && !flame.loading
  const endsAtMs = live ? Number(flame.snap.endsAt) * 1000 : opened + ROUND_MS
  const left = live ? Math.max(0, endsAtMs - now) : previewLeft
  const expired = live ? flame.snap.expired || left === 0 : previewLeft === 0
  const leader = live
    ? isZeroAddress(flame.snap.currentLeader)
      ? ''
      : flame.snap.currentLeader
    : previewLeader.address
  const leaderBurn = live
    ? flame.history.filter((row) => row.address.toLowerCase() === String(leader).toLowerCase()).at(-1)?.burn
    : previewLeader.burn
  const burned = live ? fromUnits(flame.snap.burned, decimals, 0) : previewBurned
  const remaining = live
    ? flame.token.supply != null
      ? fromUnits(flame.token.supply, decimals, 0)
      : Math.max(0, FLAME_START_SUPPLY - burned)
    : FLAME_START_SUPPLY - previewBurned
  const burnedPct = ((burned / (burned + remaining || 1)) * 100).toFixed(2)
  const nextBurn = live ? fromUnits(flame.snap.required, decimals, 0) : previewNext
  const required = nextBurn.toLocaleString('en-US')
  const prize = live ? fromUnits(flame.snap.prize, 18, 2) : 1
  const upcoming = live ? fromUnits(flame.snap.upcoming, 18, 2) : 0
  const history = live ? flame.history : FLAME_HISTORY
  const roundLabel = live ? Number(flame.snap.round) : 1

  return (
    <>
      <section className="page-hero layout-block-inner flame-hero">
        <p className="mono eyebrow">Onchain arena · Robinhood Chain</p>
        <h1>
          Hold the stack.
          <br />
          Until someone burns.
        </h1>
        <p className="body lede" style={{ marginTop: 24 }}>
          Burn APRO to join the round. The last wallet that burns when the 10 minute clock hits zero takes the ETH pot.
          Every accepted burn is destroyed, so ETH per remaining token rises.
        </p>
        <div className="flame-status">
          <p className="mono">
            Round {roundLabel} · {expired ? 'Finalizing' : live ? 'Onchain' : 'Preview'}
          </p>
          <p className="flame-clock">{expired ? '00:00' : clock(left)}</p>
          <p className="body-smaller">
            {expired ? 'Timer ended. Finalize so the last burn can claim.' : 'Last burn wins the pot · 10 minute round'}
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="layout-block-inner">
          <div className="flame-grid">
            <article className="flame-card">
              <p className="mono">Last burn</p>
              <p className="h4">{leader ? shorten(leader) : 'Open'}</p>
              <p className="body-smaller">
                {leaderBurn ? `Burned ${leaderBurn.toLocaleString('en-US')} APRO` : 'No burn yet this round'}
              </p>
            </article>
            <article className="flame-card">
              <p className="mono">Current prize</p>
              <p className="h4">{prize.toLocaleString('en-US', { maximumFractionDigits: 2 })} ETH</p>
              <p className="body-smaller">100% to the last burn this round</p>
            </article>
            <article className="flame-card">
              <p className="mono">Upcoming round</p>
              <p className="h4">{upcoming.toLocaleString('en-US', { maximumFractionDigits: 2 })} ETH</p>
              <p className="body-smaller">Saved before the next round begins</p>
            </article>
            <article className="flame-card is-accent">
              <p className="mono">Required burn</p>
              <p className="h4">{required}</p>
              <p className="body-smaller">Burn this exact amount · next burn costs 5% more</p>
            </article>
            <article className="flame-card">
              <p className="mono">Supply remaining</p>
              <p className="h4">{remaining.toLocaleString('en-US')}</p>
              <p className="body-smaller">{burnedPct}% permanently burned through Flame</p>
            </article>
            <FlameTimeCard live={Boolean(flame.live)} />
          </div>

          <div className="flame-action">
            <div>
              <p className="mono eyebrow">Burn to join the lottery</p>
              <h2>Be the last burn</h2>
              <p className="body" style={{ color: 'var(--grey-primary)', marginTop: 12, maxWidth: 520 }}>
                Required now {required} APRO. This amount is permanently destroyed. A burn in the last minute keeps the
                clock open {clock(FLOOR_MS)} longer so someone else can answer.
              </p>
            </div>
            <FlameConnect snap={flame.live ? flame.snap : null} decimals={decimals} onDone={flame.refresh} />
          </div>
        </div>
      </section>

      <section className="section dark" data-header-dark>
        <div className="layout-block-inner">
          <p className="mono eyebrow">Three steps</p>
          <h2 style={{ maxWidth: 720, marginBottom: 36 }}>Burn. Hold. Claim.</h2>
          <div className="flame-steps">
            <article>
              <p className="mono">01</p>
              <h3>Burn APRO to join</h3>
              <p className="body">Pay the exact quote. Those tokens are destroyed. You become the last burn.</p>
            </article>
            <article>
              <p className="mono">02</p>
              <h3>Hold the clock</h3>
              <p className="body">If nobody burns after you before 10 minutes is up, the pot is yours.</p>
            </article>
            <article>
              <p className="mono">03</p>
              <h3>Claim the pot</h3>
              <p className="body">After finalize, the last burn wallet pulls the full ETH prize.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="layout-block-inner">
          <p className="mono eyebrow">Burn history</p>
          <h2 style={{ marginBottom: 16 }}>See every burn.</h2>
          <div className="flame-history-meta">
            <p>
              Prize this round <strong>{prize.toLocaleString('en-US', { maximumFractionDigits: 2 })} ETH</strong>
            </p>
            <p>
              {history.length} burns · {burned.toLocaleString('en-US')} APRO destroyed
            </p>
          </div>
          <FlameYourBurns rows={history} />
          <div className="table-wrap">
            <table className="flame-table">
              <thead>
                <tr>
                  <th>Round</th>
                  <th>Wallet</th>
                  <th>Exact burn</th>
                  <th>Lasted</th>
                  <th>Clock end</th>
                  <th>Transaction</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No burns yet.</td>
                  </tr>
                ) : (
                  [...history].reverse().map((row, i, list) => {
                    const newest = i === 0
                    const nextAt = newest ? (live ? now : now - opened) : list[i - 1].atMs
                    const held = Math.max(0, nextAt - row.atMs)
                    const deadline = row.endsAt || Math.max(endsAtMs, (live ? row.atMs : opened + row.atMs) + FLOOR_MS)
                    return (
                      <tr key={row.hash} className={newest ? 'is-lead' : ''}>
                        <td>{row.round}</td>
                        <td>{shorten(row.address)}</td>
                        <td>{row.burn.toLocaleString('en-US')} APRO</td>
                        <td>{newest && !expired ? `${clock(held)} and counting` : clock(held)}</td>
                        <td>{wall(deadline)}</td>
                        <td>
                          {live ? (
                            <a className="flame-hash" href={txUrl(row.hash)} target="_blank" rel="noreferrer">
                              {shorten(row.hash)}
                            </a>
                          ) : (
                            <span className="flame-hash" title="Preview hash · not on explorer yet">
                              {shorten(row.hash)}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          <p className="body-smaller flame-note" style={{ color: 'var(--grey-primary)', marginTop: 24, maxWidth: 720 }}>
            Flame is Apeperoo’s utility layer, inspired by onchain king-of-the-hill burn arenas such as{' '}
            <a href="https://lastember.xyz/" target="_blank" rel="noreferrer">
              Last Ember
            </a>
            . {live ? 'Burns are irreversible.' : 'This page is a product preview. Burns are irreversible once contracts are live.'}{' '}
            Not affiliated with Last Ember. High-risk. Use only what you can lose.
          </p>
        </div>
      </section>

      <FAQ />
    </>
  )
}
