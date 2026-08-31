import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV, SOCIAL_X } from '../data'
import Button from './Button'
import Logo from './Logo'
import WalletButton from './WalletButton'

const LINKS = NAV.filter((item) => item.to !== '/')

export default function Header({ menuOpen, setMenuOpen, dark }) {
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, setMenuOpen])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
  }, [menuOpen])

  return (
    <>
      <header className={`site-header ${dark ? 'is-dark' : ''}`}>
        <div className="top-blur" aria-hidden="true">
          <span style={blurLayer(1, '50%', '62.5%', '75%', '87.5%')} />
          <span style={blurLayer(2, '62.5%', '75%', '87.5%', '100%')} />
          <span style={blurLayer(4, '75%', '87.5%', '100%', '100%')} />
          <span style={blurLayer(8, '87.5%', '100%', '100%', '100%')} />
        </div>
        <nav className="navbar">
          <Link to="/" className="logo" aria-label="Apeperoo home" viewTransition>
            <Logo />
          </Link>
          <div className="nav-desktop">
            {LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                viewTransition
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="nav-actions">
            <WalletButton className="nav-wallet" compact onDark={dark} connectLabel="Connect" />
            <Button className="nav-menu-btn" variant="secondary" onDark={dark} onClick={() => setMenuOpen(true)}>
              Menu
            </Button>
          </div>
        </nav>
      </header>

      <div className={`menu-overlay ${menuOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <nav className="navbar">
          <Link to="/" className="logo" aria-label="Apeperoo home" onClick={() => setMenuOpen(false)} viewTransition>
            <Logo />
          </Link>
          <div className="nav-actions">
            <WalletButton compact onDark connectLabel="Connect" />
            <Button variant="secondary" onDark onClick={() => setMenuOpen(false)}>
              Close
            </Button>
          </div>
        </nav>
        <div className="menu-links">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              viewTransition
              className={({ isActive }) => (isActive ? 'active' : '')}
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="menu-meta mono">
          <span>Token APRO · Robinhood Chain · via Pons</span>
          <a href={SOCIAL_X} target="_blank" rel="noreferrer">
            X
          </a>
        </div>
      </div>
    </>
  )
}

function blurLayer(px, a, b, c, d) {
  return {
    backdropFilter: `blur(${px}px)`,
    WebkitBackdropFilter: `blur(${px}px)`,
    maskImage: `linear-gradient(to top, rgba(0,0,0,0) ${a}, #000 ${b}, #000 ${c}, rgba(0,0,0,0) ${d})`,
    WebkitMaskImage: `linear-gradient(to top, rgba(0,0,0,0) ${a}, #000 ${b}, #000 ${c}, rgba(0,0,0,0) ${d})`,
  }
}

export function useHeaderDark(offset = 80) {
  const { pathname } = useLocation()
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const nodes = [...document.querySelectorAll('[data-header-dark]')]
    if (!nodes.length) {
      setDark(false)
      return undefined
    }
    const io = new IntersectionObserver(
      (entries) => {
        setDark(entries.some((e) => e.isIntersecting))
      },
      { rootMargin: `-${offset}px 0px -55% 0px`, threshold: 0 },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [offset, pathname])
  return dark
}
