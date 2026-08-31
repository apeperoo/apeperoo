import Button from '../components/Button'

export default function Docs() {
  return (
    <>
      <section className="page-hero layout-block-inner">
        <p className="mono eyebrow">Docs</p>
        <h1>How Apeperoo works.</h1>
        <p className="body lede" style={{ marginTop: 24, maxWidth: 720 }}>
          APRO is an ETH treasury token on Robinhood Chain via Pons. The utility is Flame. If a contract is not live,
          the page will say so.
        </p>
        <div className="actions">
          <Button to="/flame" variant="secondary" icon>
            Enter Flame
          </Button>
          <Button to="/faq" variant="secondary" icon>
            FAQ
          </Button>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="layout-block-inner">
          <h2 style={{ maxWidth: 880, marginBottom: 48 }}>The stack</h2>
          <div className="insight-grid">
            <p className="mono">Token</p>
            <p className="body">
              APRO launches on Pons with a locked WETH pool. That launch is not a listing on the Robinhood brokerage
              app, and Apeperoo is not affiliated with Robinhood Markets.
            </p>
            <p className="mono">Treasury</p>
            <p className="body">
              A 3% trading fee lands in the public treasury. Dashboard holdings are the ETH and WETH in that wallet.
              The score is ETH behind each remaining APRO.
            </p>
            <p className="mono">Flame</p>
            <p className="body">
              Flame is a last-burn lottery. Burn the exact APRO quote to join. Each burn raises the next quote by 5%
              and destroys those tokens. When the 10 minute clock ends, the last wallet takes the ETH pot. The pot is
              ETH sent to the Flame contract, including from the treasury.
            </p>
            <p className="mono">Dashboard</p>
            <p className="body">
              Live pages read published addresses. Preview numbers are not onchain. Flame prize comes from the Flame
              contract, not from the treasury balance card.
            </p>
          </div>
        </div>
      </section>

      <section className="section dark" data-header-dark>
        <div className="layout-block-inner">
          <p className="mono eyebrow">Flame rules</p>
          <h2 style={{ maxWidth: 860, marginBottom: 36 }}>Burn. Hold. Claim.</h2>
          <div className="flame-steps">
            <article>
              <p className="mono">01</p>
              <h3>Start quote</h3>
              <p className="body">The first burn in a round is 100,000 APRO. After that, each quote is 5% higher.</p>
            </article>
            <article>
              <p className="mono">02</p>
              <h3>Clock</h3>
              <p className="body">Rounds last 10 minutes. A late burn can extend the clock by the 60 second floor.</p>
            </article>
            <article>
              <p className="mono">03</p>
              <h3>Payout</h3>
              <p className="body">After finalize, the last burn claims the full ETH pot. Burns cannot be reversed.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
