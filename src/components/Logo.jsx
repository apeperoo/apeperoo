import { FLAME_PATH } from './FlameMark'

export default function Logo({ height = 34 }) {
  const w = Math.round(height * 5.85)
  return (
    <svg
      className="svg-logo"
      height={height}
      width={w}
      viewBox="0 0 200 34"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g transform="translate(0 1.2) scale(0.94)">
        <path fillRule="evenodd" d={FLAME_PATH} />
      </g>
      <text
        x="30"
        y="24"
        fontFamily="Archivo, Arial, sans-serif"
        fontSize="20"
        fontWeight="500"
        letterSpacing="0.8"
      >
        APEPEROO
      </text>
    </svg>
  )
}
