export default function HoldingsChart() {
  const d =
    'M8 118 C 40 112, 70 108, 95 96 S 150 70, 190 62 S 260 48, 310 28 S 340 22, 360 18'
  return (
    <svg className="holdings-chart" viewBox="0 0 368 140" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f3ef" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#f4f3ef" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L 360 140 L 8 140 Z`} fill="url(#chartFill)" />
      <path d={d} fill="none" stroke="#f4f3ef" strokeWidth="1.4" />
    </svg>
  )
}
