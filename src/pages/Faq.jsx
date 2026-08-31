import FAQ from '../components/FAQ'

export default function Faq() {
  return (
    <>
      <section className="page-hero layout-block-inner">
        <p className="mono eyebrow">FAQ</p>
        <h1>What Apeperoo is, and what it is not.</h1>
        <p className="body lede" style={{ marginTop: 24, maxWidth: 680 }}>
          Launch rail, treasury, and Flame, answered in one place. If a contract is not live, the page will say
          so.
        </p>
      </section>
      <FAQ plain />
    </>
  )
}
