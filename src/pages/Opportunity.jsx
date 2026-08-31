import Button from '../components/Button'
import { OPPORTUNITY_POINTS } from '../data'

export default function Opportunity() {
  return (
    <>
      <section className="page-hero layout-block-inner">
        <p className="mono eyebrow">Opportunity</p>
        <h1>Why this launch</h1>
        <p className="body lede" style={{ marginTop: 24 }}>
          Robinhood Chain puts open markets in front of a huge retail crowd. We launch APRO on Pons, liquidity locked,
          you sign from your wallet, and this is just the beginning.
        </p>
        <div className="actions">
          <Button to="/dashboard" variant="secondary" icon>
            Explore the Dashboard
          </Button>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="layout-block-inner opp-grid">
          {OPPORTUNITY_POINTS.map((item, i) => (
            <article key={item.title} className="opp-item has-pin has-pin--top-left" style={{ paddingTop: 32 }}>
              <div className="opp-icon">
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div>
                <h3 className="h5">{item.title}</h3>
                <p className="body" style={{ color: 'var(--grey-primary)', marginTop: 12 }}>
                  {item.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section dark" data-header-dark>
        <div className="layout-block-inner">
          <p className="mono eyebrow">Why Apeperoo</p>
          <h2 style={{ maxWidth: 920, marginBottom: 24 }}>
            Spot ETH is just a bag. Apeperoo puts ETH on the books, then burns around it.
          </h2>
          <p className="body lede">
            You do not have to pick between a Pons launch, a public treasury, and onchain utility. A 3% fee fills the
            treasury. Flame burns APRO. The dashboard stays public.
          </p>
        </div>
      </section>
    </>
  )
}
