import { useEffect, useRef, useState } from 'react'
import FlameMark from './FlameMark'

function smootherstep(t) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * x * (x * (x * 6 - 15) + 10)
}

export default function Loader({ onDone }) {
  const fillRef = useRef(null)
  const countRef = useRef(null)
  const [phase, setPhase] = useState('in')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.body.classList.add('is-booting')

    if (reduced) {
      if (fillRef.current) fillRef.current.style.transform = 'scaleX(1)'
      if (countRef.current) countRef.current.textContent = '100'
      const id = window.setTimeout(() => {
        document.body.classList.remove('is-booting')
        onDone()
      }, 280)
      return () => {
        window.clearTimeout(id)
        document.body.classList.remove('is-booting')
      }
    }

    const start = performance.now()
    const dur = 2680
    let frame = 0
    let shown = -1

    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = smootherstep(t)
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${eased})`
      }
      const next = Math.round(eased * 100)
      if (next !== shown && countRef.current) {
        shown = next
        countRef.current.textContent = String(next).padStart(2, '0')
      }
      if (t < 1) {
        frame = requestAnimationFrame(tick)
        return
      }
      setPhase('out')
      window.setTimeout(() => {
        document.body.classList.remove('is-booting')
        onDone()
      }, 820)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      document.body.classList.remove('is-booting')
    }
  }, [onDone])

  return (
    <div className={`boot ${phase}`} aria-hidden="true">
      <span className="boot-glow" />
      <span className="boot-pin tl" />
      <span className="boot-pin tr" />
      <span className="boot-pin bl" />
      <span className="boot-pin br" />

      <p className="boot-meta mono">APRO · ROBINHOOD CHAIN · VIA PONS</p>

      <div className="boot-core">
        <FlameMark className="boot-mark" size={64} />
        <h1 className="boot-word">APEPEROO</h1>
        <div className="boot-progress">
          <div className="boot-bar">
            <span className="boot-fill" ref={fillRef} />
          </div>
          <p className="boot-count mono" ref={countRef}>
            00
          </p>
        </div>
      </div>
    </div>
  )
}
