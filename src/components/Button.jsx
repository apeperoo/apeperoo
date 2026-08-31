import { Link } from 'react-router-dom'

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export default function Button({
  to,
  href,
  onClick,
  children,
  variant = 'secondary',
  icon = false,
  onDark = false,
  type = 'button',
  className = '',
  disabled = false,
}) {
  const cls = `ui-button ${variant} ${icon ? 'has-icon' : ''} ${onDark ? 'is-on-dark' : ''} ${className}`.trim()

  const inner = (
    <>
      <span className="content">
        <span>{children}</span>
        <span>{children}</span>
      </span>
      {icon && (
        <span className="icon">
          <span>
            <Arrow />
          </span>
          <span>
            <Arrow />
          </span>
        </span>
      )}
    </>
  )

  if (to) {
    return (
      <Link className={cls} to={to} viewTransition>
        {inner}
      </Link>
    )
  }

  if (href) {
    return (
      <a className={cls} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {inner}
      </a>
    )
  }

  return (
    <button className={cls} type={type} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  )
}
