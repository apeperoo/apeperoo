import { useEffect, useMemo, useRef } from 'react'
import Lenis from 'lenis'
import { LenisContext } from '../hooks/lenis-context'
import 'lenis/dist/lenis.css'

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)
  const listeners = useRef(new Set())

  const api = useMemo(
    () => ({
      ref: lenisRef,
      subscribe(fn) {
        listeners.current.add(fn)
        return () => listeners.current.delete(fn)
      },
    }),
    [],
  )

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.28,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1,
      autoRaf: false,
    })
    lenisRef.current = lenis

    const notify = () => {
      listeners.current.forEach((fn) => fn())
    }

    lenis.on('scroll', notify)
    notify()

    let id = 0
    const raf = (time) => {
      lenis.raf(time)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(id)
      lenis.off('scroll', notify)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <LenisContext.Provider value={api}>{children}</LenisContext.Provider>
}
