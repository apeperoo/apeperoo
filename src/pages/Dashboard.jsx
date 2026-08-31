import { useEffect, useMemo, useState } from 'react'
import { DASHBOARD_METRICS } from '../data'
import useTreasury from '../hooks/useTreasury'
import { fmtNum } from '../lib/format'

export default function Dashboard() {
  const treasury = useTreasury()
  const [eth, setEth] = useState({ usd: 3420.12, usd_24h_change: 1.24 })

  useEffect(() => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 4000)
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true', {
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.ethereum?.usd) setEth(d.ethereum)
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer))
    return () => {
      clearTimeout(timer)
      ctrl.abort()
    }
  }, [])

  const live = treasury.live
  const values = useMemo(() => {
    const ethUsd = eth?.usd ?? 0
    const holdings = live ? treasury.holdings : 128420
    const rewards = live ? treasury.rewards : 3186
    const tokens = live ? treasury.supply : 42_000_000
    const aperoUsd = live ? (treasury.price != null && ethUsd ? treasury.price * ethUsd : null) : 2.18
    const ethNav = holdings != null && ethUsd ? holdings * ethUsd : null
    const nav = ethNav
    const mcap = aperoUsd != null && tokens != null ? aperoUsd * tokens : null

    const money = (n, digits = 2) => (n == null ? 'n/a' : `$${fmtNum(n, digits)}`)
    const count = (n, digits = 0) => (n == null ? 'n/a' : fmtNum(n, digits))

    return {
      apro: money(aperoUsd),
      eth: ethUsd ? money(ethUsd) : 'Loading...',
      volume: live ? 'n/a' : '4.2M',
      mcap: money(mcap, 0),
      holdings: count(holdings, 0),
      rewards: rewards != null ? `${fmtNum(rewards, 0)} ETH` : 'n/a',
      concentration: holdings != null && tokens ? fmtNum((holdings / tokens) * 1000, 4) : 'n/a',
      ethNav: money(ethNav, 0),
      nav: money(nav, 0),
      navShare: nav != null && tokens ? money(nav / tokens, 4) : 'n/a',
      mnav: mcap != null && nav ? fmtNum(mcap / nav, 3) : 'n/a',
      fdMnav: mcap != null && nav ? fmtNum(mcap / nav, 3) : 'n/a',
    }
  }, [eth, live, treasury.holdings, treasury.price, treasury.rewards, treasury.supply])

  const deltas = live
    ? {
        eth: eth?.usd_24h_change != null ? `${eth.usd_24h_change >= 0 ? '+' : ''}${eth.usd_24h_change.toFixed(2)}%` : 'n/a',
      }
    : {
        apro: '+1.8%',
        eth: eth?.usd_24h_change != null ? `${eth.usd_24h_change >= 0 ? '+' : ''}${eth.usd_24h_change.toFixed(2)}%` : 'n/a',
        volume: '+0.4%',
        mcap: '+1.8%',
        holdings: '+2.4%',
        rewards: '+86 ETH',
      }

  return (
    <>
      <section className="page-hero layout-block-inner" style={{ minHeight: 'auto' }}>
        <p className="mono eyebrow">Dashboard</p>
        <h1>Key Metrics</h1>
        <p className="body lede" style={{ marginTop: 16 }}>
          Holdings, price, and ETH per token. Open a card tip for the definition. APRO launches on Robinhood Chain via
          Pons, paired against WETH.
          {live
            ? ' Live reads use the published contract and treasury addresses.'
            : ' Figures below are a product preview until APRO and treasury addresses are live.'}
        </p>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="layout-block-inner">
          <div className="metrics">
            {DASHBOARD_METRICS.map((m) => (
              <article key={m.id} className="metric has-pin has-pin--top-left">
                <p className="mono">{m.label}</p>
                <p className="value" style={{ fontSize: 40, letterSpacing: '-0.04em', marginTop: 12 }}>
                  {values[m.id]}
                </p>
                {deltas[m.id] && (
                  <p className="mono" style={{ color: 'var(--brand-blue-primary)', marginTop: 8 }}>
                    {deltas[m.id]}
                  </p>
                )}
                <p className="tip body-smaller">{m.hint}</p>
              </article>
            ))}
          </div>
          <details className="disclaimer" style={{ marginTop: 48 }}>
            <summary>Disclaimer</summary>
            <p className="body-blog" style={{ marginTop: 12 }}>
              The information and metrics presented on this dashboard are provided for informational purposes only and
              should not be relied upon for investment decisions. Apeperoo is not affiliated with Robinhood Markets. A
              Pons launch is not a listing on the Robinhood brokerage app. Nothing contained herein constitutes tax,
              legal, insurance or investment advice, or the recommendation of or an offer to sell, or the solicitation
              of an offer to buy or invest, in any security or token.{' '}
              {live
                ? 'Onchain figures are read from published contract and treasury addresses. ETH price is sourced from public market data.'
                : 'Demo figures on this site are illustrative unless otherwise sourced from public market data.'}
            </p>
          </details>
        </div>
      </section>
    </>
  )
}
