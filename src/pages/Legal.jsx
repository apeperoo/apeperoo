export default function Legal({ kind }) {
  const privacy = kind === 'privacy'
  return (
    <section className="page-hero layout-block-inner legal" style={{ minHeight: 'auto', paddingBottom: 96 }}>
      <p className="mono eyebrow">{privacy ? 'Legal' : 'Legal'}</p>
      <h1 className="h2">{privacy ? 'Privacy Policy' : 'Terms of Use'}</h1>
      <p className="mono" style={{ marginTop: 12 }}>
        Last updated August 28, 2026
      </p>
      {privacy ? (
        <>
          <p>
            Apeperoo collects only what is needed to operate this site, for example standard server logs. We do not sell
            personal information.
          </p>
          <p>
            Analytics, if enabled, are used to understand aggregate traffic. Requests to access or delete data we hold
            about you can be made through the channels listed on this site.
          </p>
          <p>
            This policy may change as the project grows. Material updates will be posted on this page.
          </p>
        </>
      ) : (
        <>
          <p>
            This website is for information about the Apeperoo treasury project, launching on Robinhood Chain via Pons.
            Apeperoo is not affiliated with Robinhood Markets. A Pons launch is not a Robinhood brokerage listing. Nothing
            here is investment,
            legal, or tax advice, or an offer to sell any security or token.
          </p>
          <p>
            Digital assets are volatile and may lose value. Dashboard metrics may be delayed, incomplete, or
            illustrative. You are responsible for your own decisions.
          </p>
          <p>
            Content on this site is owned by Apeperoo unless otherwise noted. You may not scrape, republish, or misuse
            the site in a way that harms the project or other users.
          </p>
        </>
      )}
    </section>
  )
}
