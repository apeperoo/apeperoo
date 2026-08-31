import { useState } from 'react'
import { FAQS } from '../data'

export default function FAQ({ plain = false }) {
  const [open, setOpen] = useState(0)

  return (
    <section className="section" style={plain ? { paddingTop: 0 } : undefined}>
      <div className={`layout-block-inner ${plain ? '' : 'faq-layout'}`}>
        {!plain && (
          <div>
            <p className="mono eyebrow">FAQ</p>
            <h2>got more questions?</h2>
          </div>
        )}
        <div>
          {FAQS.map((item, i) => (
            <div key={item.q} className={`faq-item ${open === i ? 'open' : ''}`}>
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)}>
                <strong>
                  <span className="faq-num mono">{String(i + 1).padStart(2, '0')}</span>
                  {item.q}
                </strong>
                <span className="plus" />
              </button>
              <p className="answer body">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
