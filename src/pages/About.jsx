import Button from '../components/Button'

export default function About() {
  return (
    <>
      <section className="page-hero layout-block-inner">
        <p className="mono eyebrow">About</p>
        <h1>Apeperoo is an ETH treasury token on Robinhood Chain.</h1>
        <p className="body lede" style={{ marginTop: 24, maxWidth: 720 }}>
          The token is APRO. It launches on Pons, pairs against WETH, and sits next to a public ETH treasury. The job is
          simple: grow ETH per remaining token, in the open.
        </p>
        <div className="actions">
          <Button to="/flame" variant="secondary" icon>
            Enter Flame
          </Button>
          <Button to="/dashboard" variant="secondary" icon>
            Explore the Dashboard
          </Button>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="layout-block-inner">
          <h2 style={{ maxWidth: 880, marginBottom: 48 }}>What this project is</h2>
          <div className="insight-grid">
            <p className="mono">The token</p>
            <p className="body">
              APRO is a fixed-supply token launching through Pons, a permissionless launchpad on Robinhood Chain. One
              wallet-signed transaction deploys the token and a locked WETH pool. Trading starts where the liquidity
              lives. This is not a listing on the Robinhood brokerage app, not Robinhood stock, and not affiliated with
              Robinhood Markets.
            </p>
            <p className="mono">The treasury</p>
            <p className="body">
              Beside the pool, Apeperoo treats ETH as the reserve. A 3% trading fee lands in the treasury. Flame pots
              are funded from that book. Holdings and ETH per token show on the dashboard.
            </p>
            <p className="mono">The utility</p>
            <p className="body">
              Flame is a burn lottery: destroy the APRO quote to join, and the last burn when the 10 minute clock ends
              takes the ETH pot. Every accepted burn is destroyed, so ETH per remaining token rises.
            </p>
          </div>
        </div>
      </section>

      <section className="section dark" data-header-dark>
        <div className="layout-block-inner">
          <p className="mono eyebrow">How it fits together</p>
          <h2 style={{ maxWidth: 860, marginBottom: 36 }}>Launch. Compound. Burn.</h2>
          <div className="flame-steps">
            <article>
              <p className="mono">01</p>
              <h3>Launch on Pons</h3>
              <p className="body">APRO goes live on Robinhood Chain with locked WETH liquidity. You sign it from your wallet.</p>
            </article>
            <article>
              <p className="mono">02</p>
              <h3>Hold ETH in public</h3>
              <p className="body">A 3% fee goes to the treasury. The dashboard is the report. Flame pots are sent from that book.</p>
            </article>
            <article>
              <p className="mono">03</p>
              <h3>Flame burns APRO</h3>
              <p className="body">Burns destroy APRO. Fewer tokens sit in front of the same ETH treasury.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="layout-block-inner">
          <h2 style={{ maxWidth: 880, marginBottom: 48 }}>What this is not</h2>
          <div className="insight-grid">
            <p className="mono">Not Robinhood</p>
            <p className="body">
              Apeperoo uses Robinhood Chain and Pons as rails. It is not Robinhood Markets, not HOOD, and not an
              exchange listing. PONS is the launchpad token, not APRO.
            </p>
            <p className="mono">Not a guarantee</p>
            <p className="body">
              Flame is a product preview until contracts are live. Burns cannot be reversed. Token prices and
              liquidity can move sharply. Use only what you can lose. This is not investment advice.
            </p>
            <p className="mono">Not a closed book</p>
            <p className="body">
              The point of the dashboard and Flame history is the same: you should be able to see what
              the treasury and the utility are doing, instead of taking a story on faith.
            </p>
          </div>
          <div className="actions" style={{ marginTop: 40 }}>
            <Button to="/flame" variant="secondary" icon>
              Enter Flame
            </Button>
            <Button to="/opportunity" variant="secondary" icon>
              See the opportunity
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
