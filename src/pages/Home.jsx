import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import FAQ from '../components/FAQ'
import HoldingsChart from '../components/HoldingsChart'
import MachineVisual from '../components/MachineVisual'
import { PRODUCTIVITY, PROPOSITIONS } from '../data'
import { clamp, usePinnedProgress } from '../hooks/usePinnedProgress'

const OPP_LINES = [
  'Robinhood Chain puts open markets',
  'in front of a huge retail crowd.',
  'We launch APRO on Pons, liquidity locked,',
  'you sign from your wallet,',
  'and this is just the beginning.',
]

function ChartMetrics() {
  return (
    <>
      <p className="mono">Total ETH holdings · preview</p>
      <p className="chart-value">128,420</p>
      <p className="mono">ETH earned · preview</p>
      <p className="chart-sub">3,186 ETH</p>
      <HoldingsChart />
      <div className="chart-cta">
        <Button to="/dashboard" variant="secondary" onDark icon>
          More in Dashboard
        </Button>
      </div>
    </>
  )
}

export default function Home() {
  const heroRef = useRef(null)
  const stackRef = useRef(null)
  const oppRef = useRef(null)
  const heroP = usePinnedProgress(heroRef)
  const stackP = usePinnedProgress(stackRef)
  const oppP = usePinnedProgress(oppRef)

  const heroDark = heroP < 0.16
  const stackDark = stackP > 0.26
  const stepP = clamp((heroP - 0.58) / 0.4)
  const prodT = stepP * PRODUCTIVITY.length
  const stackT = stackP * PROPOSITIONS.length
  const prodIndex = Math.min(PRODUCTIVITY.length - 1, Math.floor(prodT))
  const stackIndex = Math.min(PROPOSITIONS.length - 1, Math.floor(stackT))

  return (
    <>
      <section className="pin-track hero-track" ref={heroRef}>
        <div className="pin-sticky hero-sticky" data-header-dark={heroDark ? true : undefined}>
          <span className="frame-pin tl" />
          <span className="frame-pin tr" />
          <span className="frame-pin bl" />
          <span className="frame-pin br" />
          <div className="hero-scene">
            <MachineVisual side="right" quality="high" />
            <div className="hero-chart-layer">
              <ChartMetrics />
            </div>
            <div className="hero-copy">
              <h1>
                Ape energy.
                <br />
                ETH reserve.
              </h1>
              <div className="hero-actions">
                <Button to="/dashboard" variant="accent" icon onDark>
                  Explore the Dashboard
                </Button>
                <Button to="/flame" variant="secondary" onDark>
                  Enter Flame
                </Button>
              </div>
            </div>
            <div className="hero-bottom">
              <div>
                <p className="mono">Launching via Pons on Robinhood as</p>
                <p className="h6">APRO</p>
              </div>
              <p className="body-smaller hero-mid">
                Apeperoo is an ETH treasury launching on Robinhood Chain via Pons. Burn APRO in Flame.
                Watch ETH per token on the dashboard.
              </p>
              <Link to="/faq" className="news-chip" viewTransition>
                <p className="mono">FAQ</p>
                <p className="body-smaller">What is Flame and the ETH treasury?</p>
              </Link>
            </div>
          </div>
          <div className="prod-reveal">
            <div className="prod-cols">
              <div className="prod-copy">
                <span className="pin-dot" />
                <h2>ETH that stays busy</h2>
                <p className="body">
                  Launch on Pons, pair against WETH, then put the treasury to work. Burns cut supply.
                  The score is ETH behind each remaining APRO.
                </p>
              </div>
              <div className="prod-chart-slot">
                <div className="prod-chart-card mobile-only">
                  <ChartMetrics />
                </div>
              </div>
              <div className="prod-steps">
                {PRODUCTIVITY.map((item, i) => {
                  const dist = Math.abs(prodT - (i + 0.5))
                  const active = i === prodIndex
                  return (
                    <article
                      key={item.n}
                      className={`prod-step ${active ? 'is-active' : ''}`}
                      style={{ opacity: clamp(1.05 - dist * 0.55, 0.2, 1) }}
                    >
                      <p className="mono">{item.n}</p>
                      <h3>{item.title}</h3>
                      {active && <p className="body prod-step-body">{item.body}</p>}
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pin-track stack-track" ref={stackRef}>
        <div
          className={`pin-sticky stack-sticky ${stackDark ? 'is-dark' : ''}`}
          data-header-dark={stackDark ? true : undefined}
        >
          <div className="stack-head">
            <p className="mono eyebrow">The stack</p>
            <h2>Treasury. Burn. Flame.</h2>
          </div>
          <div className="stack-body">
            <div className="stack-copy">
              {PROPOSITIONS.map((item, i) => {
                const dist = Math.abs(stackT - (i + 0.5))
                const active = i === stackIndex
                return (
                  <article
                    key={item.id}
                    className={`stack-item ${active ? 'is-active' : ''}`}
                    style={{
                      opacity: clamp(1.08 - dist * 1.15, 0, 1),
                      transform: `translateY(${(i - stackIndex) * 18}px)`,
                      pointerEvents: active ? 'auto' : 'none',
                    }}
                  >
                    <p className="mono">{item.kicker}</p>
                    <h3>{item.title}</h3>
                    <p className="body">{item.body}</p>
                  </article>
                )
              })}
            </div>
            <div className="stack-visual">
              <MachineVisual lite mode={stackDark ? 'wire' : 'solid'} />
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band dark cta-split" data-header-dark>
        <div className="layout-block-inner cta-grid">
          <div>
            <h2>
              Public treasury.
              <br />
              Real burns.
            </h2>
            <div className="hero-actions" style={{ marginTop: 28 }}>
              <Button to="/dashboard" variant="accent" onDark icon>
                Explore the Dashboard
              </Button>
              <Button to="/flame" variant="secondary" onDark>
                Enter Flame
              </Button>
            </div>
          </div>
          <div className="cta-visual">
            <MachineVisual lite progress={0.82} mode="wire" />
          </div>
        </div>
      </section>

      <section className="pin-track opp-track" ref={oppRef}>
        <div className="pin-sticky opp-sticky">
          <div className="layout-block-inner opp-reveal">
            <div>
              <span className="pin-dot" />
              <p className="mono eyebrow">Why this launch</p>
            </div>
            <div className="opp-lines">
              {OPP_LINES.map((line, i) => {
                const start = i / OPP_LINES.length
                const local = clamp((oppP - start) / (0.72 / OPP_LINES.length))
                return (
                  <p key={line} className="opp-line" style={{ opacity: 0.16 + local * 0.84 }}>
                    {line}
                  </p>
                )
              })}
            </div>
            <Button to="/opportunity" variant="secondary" icon>
              Learn more
            </Button>
          </div>
        </div>
      </section>

      <FAQ />
    </>
  )
}
