import type { CSSProperties } from 'react'

type GrassFieldProps = {
  className?: string
  tone?: 'light' | 'dark'
}

const blades = Array.from({ length: 82 }, (_, index) => {
  const x = index * 15 - 8
  const seed = (index * 37) % 71
  const height = 46 + seed * 1.32
  const lean = ((index * 19) % 25) - 12
  const width = 3 + ((index * 11) % 6)
  const tipX = x + lean
  const path = `M ${x - width} 180 C ${x - width - lean * 0.2} ${180 - height * 0.34}, ${tipX - width * 0.3} ${180 - height * 0.81}, ${tipX} ${180 - height} C ${tipX + width * 0.35} ${180 - height * 0.72}, ${x + width + lean * 0.15} ${180 - height * 0.34}, ${x + width} 180 Z`
  return { path, index }
})

export default function GrassField({ className = '', tone = 'light' }: GrassFieldProps) {
  return (
    <svg
      className={`grass-field grass-field--${tone} ${className}`}
      viewBox="0 0 1200 180"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {blades.map(({ path, index }) => (
        <path
          key={index}
          d={path}
          className="grass-field__blade"
          style={{
            fill: `var(--grass-${index % 4})`,
            opacity: 0.62 + (index % 5) * 0.075,
            animationDelay: `${-(index % 13) * 0.37}s`,
            animationDuration: `${3.4 + (index % 7) * 0.37}s`,
          } as CSSProperties}
        />
      ))}
    </svg>
  )
}
