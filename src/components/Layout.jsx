import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header, { useHeaderDark } from './Header'
import Loader from './Loader'
import PageVeil from './PageVeil'
import SmoothScroll from './SmoothScroll'

const TITLES = {
  '/': 'Apeperoo : Home',
  '/about': 'Apeperoo : About',
  '/staking': 'Apeperoo : Flame',
  '/investors': 'Apeperoo : Flame',
  '/opportunity': 'Apeperoo : Opportunity',
  '/docs': 'Apeperoo : Docs',
  '/faq': 'Apeperoo : FAQ',
  '/news': 'Apeperoo : FAQ',
  '/flame': 'Apeperoo : Flame',
  '/dashboard': 'Apeperoo : Dashboard',
  '/privacy-policy': 'Apeperoo : Privacy Policy',
  '/terms-of-use': 'Apeperoo : Terms of Use',
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [booted, setBooted] = useState(false)
  const location = useLocation()
  const headerDark = useHeaderDark()
  const finishBoot = useCallback(() => setBooted(true), [])

  useEffect(() => {
    const base = TITLES[location.pathname]
    document.title = base || 'Apeperoo'
  }, [location.pathname])

  return (
    <SmoothScroll>
      <div className={`site ${booted ? 'is-live' : 'is-waiting'}`}>
        <div className="gradient-bg-light" />
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} dark={headerDark} />
        <PageVeil />
        <main key={location.pathname} className={`site-main ${location.pathname === '/' ? '' : 'is-inner'}`}>
          <Outlet />
        </main>
        <Footer />
      </div>
      {!booted && <Loader onDone={finishBoot} />}
    </SmoothScroll>
  )
}
