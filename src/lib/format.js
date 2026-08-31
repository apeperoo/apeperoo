export function shorten(value) {
  if (!value) return ''
  const text = String(value)
  if (text.length <= 12) return text
  return `${text.slice(0, 6)}…${text.slice(-4)}`
}

export function pad(n) {
  return String(n).padStart(2, '0')
}

export function clock(ms) {
  const safe = Math.max(0, ms)
  const m = Math.floor(safe / 60000)
  const s = Math.floor((safe % 60000) / 1000)
  return `${pad(m)}:${pad(s)}`
}

export function clockLong(ms) {
  const safe = Math.max(0, ms)
  const d = Math.floor(safe / 86400000)
  const h = Math.floor((safe % 86400000) / 3600000)
  const m = Math.floor((safe % 3600000) / 60000)
  if (d > 0) return `${d}d ${pad(h)}h ${pad(m)}m`
  return `${pad(h)}:${pad(m)}`
}

export function wall(ts) {
  const d = new Date(ts)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function fmtNum(n, digits = 2) {
  if (n == null || Number.isNaN(n)) return 'n/a'
  return n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits })
}

export function fromUnits(value, decimals = 18, digits = 2) {
  if (value == null) return 0
  const base = 10n ** BigInt(decimals)
  const whole = value / base
  const frac = value % base
  const asNumber = Number(whole) + Number(frac) / Number(base)
  if (!Number.isFinite(asNumber)) return Number(whole)
  const factor = 10 ** digits
  return Math.round(asNumber * factor) / factor
}

export function toUnits(value, decimals = 18) {
  const text = String(value || '').trim()
  if (!text || !/^\d+(\.\d+)?$/.test(text)) return 0n
  const [whole, frac = ''] = text.split('.')
  const fracPadded = (frac + '0'.repeat(decimals)).slice(0, decimals)
  return BigInt(whole || '0') * 10n ** BigInt(decimals) + BigInt(fracPadded || '0')
}

export function isZeroAddress(value) {
  return !value || /^0x0+$/i.test(String(value))
}

export function txError(err) {
  const raw = err?.shortMessage || err?.details || err?.message || 'Transaction failed'
  if (/user rejected|denied|rejected the request/i.test(raw)) return 'Request cancelled'
  if (/insufficient/i.test(raw)) return 'Not enough balance or gas'
  if (/allowance|transfer amount exceeds/i.test(raw)) return 'Approve APRO first, then retry'
  return raw.split('\n')[0].slice(0, 140)
}
