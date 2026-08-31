import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { NAV, SOCIAL_X } from '../data'
import Button from './Button'
import Logo from './Logo'
import { useLenis } from '../hooks/lenis-context'

export default function Footer() {
  const { ref: lenisRef, subscribe } = useLenis() || {}
  const footerRef = useRef(null)
  const wrapRef = useRef(null)
  const markRef = useRef(null)

  useEffect(() => {
    const footer = footerRef.current
    const wrap = wrapRef.current
    const mark = markRef.current
    if (!footer || !wrap || !mark) return undefined

    const fit = () => {
      mark.style.fontSize = '100px'
      const textW = mark.getBoundingClientRect().width
      if (!textW) return
      const target = Math.min(window.innerWidth * 0.94, 1920 * 0.94)
      wrap.style.fontSize = `${(100 * target) / textW}px`
      mark.style.fontSize = ''
    }

    const measure = () => {
      const rect = wrap.getBoundingClientRect()
      const h = Math.max(1, rect.height)
      const p = Math.min(1, Math.max(0, (window.innerHeight + h * 0.4 - rect.top) / (h * 1.4)))
      footer.style.setProperty('--in', p.toFixed(4))
    }

    const onResize = () => {
      fit()
      measure()
    }

    const start = () => {
      fit()
      measure()
    }

    start()
    document.fonts?.ready?.then(start)
    window.addEventListener('resize', onResize)
    const unsub = subscribe?.(measure)
    if (!unsub) window.addEventListener('scroll', measure, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      unsub?.()
      if (!unsub) window.removeEventListener('scroll', measure)
    }
  }, [subscribe])

  return (
    <footer className="site-footer site-footer-dark" data-header-dark ref={footerRef}>
      <div className="layout-block-inner footer-inner">
        <div className="footer-top">
          <Logo height={32} />
          <Button
            variant="secondary"
            onDark
            onClick={() => {
              if (lenisRef?.current) lenisRef.current.scrollTo(0, { duration: 1.35 })
              else window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Back to top
          </Button>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <p className="mono">Token</p>
            <p className="h6">APRO via Pons on Robinhood Chain</p>
          </div>
          <div className="footer-col">
            <h3>Navigation</h3>
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} viewTransition>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="footer-col">
            <h3>Resources</h3>
            <Link to="/docs" viewTransition>
              Docs
            </Link>
            <Link to="/privacy-policy" viewTransition>
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" viewTransition>
              Terms of Use
            </Link>
          </div>
          <div className="footer-col">
            <h3>Social</h3>
            <a href={SOCIAL_X} target="_blank" rel="noreferrer">
              X
            </a>
          </div>
        </div>

        <div className="footer-bottom body-smaller">
          <span>© {new Date().getFullYear()} Apeperoo. All rights reserved</span>
        </div>
      </div>

      <div className="footer-wordmark-wrap" ref={wrapRef} aria-hidden="true">
        <span className="footer-wordmark" ref={markRef}>
          Apeperoo
        </span>
      </div>
    </footer>
  )
}
