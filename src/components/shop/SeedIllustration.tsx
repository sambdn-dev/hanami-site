import styles from './Shop.module.css'

export default function SeedIllustration({ variant, compact = false }: { variant: 'shade' | 'resilience'; compact?: boolean }) {
  const shade = variant === 'shade'
  return <div className={`${styles.botanical} ${shade ? styles.shade : styles.resilience} ${compact ? styles.botanicalCompact : ''}`} aria-hidden="true">
    <svg viewBox="0 0 580 540" fill="none">
      <circle cx={shade ? 190 : 394} cy="137" r="105" className={styles.sun} />
      <path d="M0 434C105 403 169 468 288 444S442 421 580 441V540H0Z" fill="currentColor" opacity=".055" />
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M270 449C264 358 283 222 308 94" strokeWidth="3" />
        <path d="M270 451C249 334 231 247 192 181M269 448C300 355 343 285 385 212" strokeWidth="2.5" />
        <path d="M264 407C218 379 177 349 145 292C197 313 230 346 264 407Z" fill="currentColor" opacity=".35" strokeWidth="1" />
        <path d="M274 372C301 313 330 303 357 295C346 327 323 351 274 372Z" fill="currentColor" opacity=".65" strokeWidth="1" />
        <path d="M280 309C246 291 217 264 215 237C244 249 267 274 280 309Z" fill="currentColor" opacity=".7" strokeWidth="1" />
        <path d="M292 236C320 207 342 188 358 160C355 198 337 226 292 236Z" fill="currentColor" opacity=".35" strokeWidth="1" />
        {[0, 1, 2, 3, 4, 5].map(i => <g key={i} transform={`translate(${301 - i * 4} ${118 + i * 17}) rotate(11)`}><path d="M0 0C-17-9-29-16-31-29C-13-27-3-12 0 0Z" fill="currentColor" opacity=".75" /><path d="M1 0C19-1 30-7 37-23C21-22 9-13 1 0Z" fill="currentColor" opacity=".6" /></g>)}
        <path d="M270 450L255 490M270 449L293 495M270 449L270 510M258 481L242 496M286 481L313 496M269 482L257 509" strokeWidth="1.6" opacity=".38" />
      </g>
      <path d="M65 455H515" stroke="currentColor" opacity=".2" />
      <text x="66" y="480" fontSize="10" letterSpacing="2" fill="currentColor" opacity=".7">{shade ? 'LUMIÈRE / ÉQUILIBRE / DENSITÉ' : 'RACINES / RÉSILIENCE / DURÉE'}</text>
    </svg>
    <span>Étude botanique · illustration</span>
  </div>
}
