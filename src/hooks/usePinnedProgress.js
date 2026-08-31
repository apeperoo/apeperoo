import { useEffect, useState } from 'react'
import { useLenis } from './lenis-context'

export function clamp(n, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n))
}

export function usePinnedProgress(ref) {
  const lenisApi = useLenis()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    let last = -1
    const measure = () => {
      const rect = el.getBoundingClientRect()
      const total = Math.max(1, el.offsetHeight - window.innerHeight)
      const p = clamp(-rect.top / total)
      el.style.setProperty('--p', p.toFixed(4))
      const snapped = Math.round(p * 20) / 20
      if (snapped !== last) {
        last = snapped
        setProgress(snapped)
      }
    }

    measure()
    const unsub = lenisApi?.subscribe?.(measure)
    if (!unsub) window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      unsub?.()
      if (!unsub) window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [ref, lenisApi])

  return progress
}
