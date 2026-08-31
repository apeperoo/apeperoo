import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from '../hooks/lenis-context'

let booted = false

export default function PageVeil() {
  const location = useLocation()
  const lenisApi = useLenis()
  const [phase, setPhase] = useState('idle')

  useEffect(() => {
    if (!booted) {
      booted = true
      return undefined
    }

    setPhase('cover')
    const scroll = window.setTimeout(() => {
      lenisApi?.ref.current?.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)
      setPhase('hold')
    }, 520)
    const reveal = window.setTimeout(() => setPhase('reveal'), 780)
    const idle = window.setTimeout(() => setPhase('idle'), 1750)

    return () => {
      window.clearTimeout(scroll)
      window.clearTimeout(reveal)
      window.clearTimeout(idle)
    }
  }, [location.pathname, lenisApi])

  return (
    <div className={`page-veil is-${phase}`} aria-hidden="true">
      <span className="page-veil-line" />
    </div>
  )
}
