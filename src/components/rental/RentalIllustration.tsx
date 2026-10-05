import styles from './Rental.module.css'

export type RentalIllustrationKind =
  | 'overseeding-tool'
  | 'compost-spreader'
  | 'battery-spreader'
  | 'rotary-spreader'
  | 'scarifier'
  | 'pack'

function OverseedingTool() {
  return <g>
    <path d="M279 193 345 76M345 76l38 17" strokeWidth="10" />
    <path d="m332 73 45 20" stroke="#293C32" strokeWidth="15" />
    <path d="M184 233h126M189 198v56M306 196v58" strokeWidth="7" />
    {[193, 211, 229, 247, 265, 283, 301].map(x => <g key={x}>
      <ellipse cx={x} cy="231" rx="13" ry="39" fill="#F5F3E9" strokeWidth="2.5" />
      <path d={`M${x} 188v10m0 65v11m-13-53h-7m40 0h-7m-25-25-5-8m23 55 5 8m-23 0 5-8m15-37 5-8`} strokeWidth="3" />
    </g>)}
    <path d="m212 197 19-32h46l27 32" strokeWidth="6" />
  </g>
}

function CompostSpreader() {
  return <g>
    <path d="m276 201 79-112m-1-1 43 24" strokeWidth="9" />
    <path d="m348 84 49 27" stroke="#293C32" strokeWidth="14" />
    <path d="M158 194v61m154-61v61M155 224h160" strokeWidth="6" />
    <path d="M176 183h116c34 0 34 85 0 85H176Z" fill="#DBE3CD" strokeWidth="3" />
    <ellipse cx="176" cy="225.5" rx="23" ry="42.5" fill="#EEF0E5" strokeWidth="3" />
    {[191, 207, 223, 239, 255, 271, 287].map(x => <path key={x} d={`M${x} 186c23 10 23 66 0 79`} strokeWidth="1" opacity=".45" />)}
    {[198, 211, 224, 237, 250].map(y => <path key={y} d={`M154 ${y}h160`} strokeWidth="1" opacity=".4" />)}
    <path d="M232 184v81m-13-60h32v35h-32z" strokeWidth="2" />
    <circle cx="175" cy="225" r="6" fill="#6D805F" strokeWidth="2" />
  </g>
}

function BatterySpreader() {
  return <g>
    <path d="M196 92h118l-10 75H206Z" fill="#D3DFC2" strokeWidth="3" />
    <path d="M202 92c11-24 91-24 106 0M211 108h87" strokeWidth="3" />
    <path d="M210 165h91l-5 47-23 19h-41l-21-17Z" fill="#718659" strokeWidth="3" />
    <path d="M295 144h27c19 0 29 45 14 59h-36m20-49c9 6 12 24 5 30" stroke="#293C32" strokeWidth="9" />
    <path d="M230 232h45l12 17h-69Z" fill="#293C32" strokeWidth="3" />
    <ellipse cx="252" cy="247" rx="42" ry="7" fill="#EFF0E6" strokeWidth="3" />
    <path d="M179 256h34v31h-34zM292 256h34v31h-34z" fill="#293C32" strokeWidth="2" />
    <path d="M186 254v-5h20v5m93 0v-5h20v5" strokeWidth="2" />
    <path d="M346 256h37v30h-37z" fill="#E6E9DA" strokeWidth="2" />
    <path d="M356 265h15m-7 0v10" strokeWidth="2" />
  </g>
}

function RotarySpreader() {
  return <g>
    <path d="m280 180 51-95m0 0 52 23" strokeWidth="8" />
    <path d="m327 80 56 24" stroke="#293C32" strokeWidth="13" />
    <path d="m180 136 116 0-21 65h-73Z" fill="#D0DCC0" strokeWidth="3" />
    <ellipse cx="238" cy="136" rx="58" ry="11" fill="#E3E9D8" strokeWidth="3" />
    <path d="M222 201v33m31-33v33m-39-14h48" strokeWidth="5" />
    <ellipse cx="238" cy="227" rx="37" ry="7" fill="#EEF0E4" strokeWidth="3" />
    <path d="M185 249h111m-81-47-28 49m74-50 24 51" strokeWidth="6" />
    <circle cx="185" cy="254" r="30" fill="#293C32" strokeWidth="3" />
    <circle cx="294" cy="254" r="30" fill="#293C32" strokeWidth="3" />
    <circle cx="185" cy="254" r="12" fill="#D2DAC6" strokeWidth="3" />
    <circle cx="294" cy="254" r="12" fill="#D2DAC6" strokeWidth="3" />
  </g>
}

function Scarifier() {
  return <g>
    <path d="m284 202 45-99 30 12m-80 87 21-106 29 7" strokeWidth="7" />
    <path d="m297 91 62 19" stroke="#293C32" strokeWidth="13" />
    <path d="M169 216h135l-17-30h-91Z" fill="#718659" strokeWidth="3" />
    <path d="M207 185v-28h53v29" fill="#E0E7D2" strokeWidth="3" />
    <path d="M163 216h153v34H163Z" fill="#EEF0E5" strokeWidth="3" />
    <path d="M313 218h30l23 28-56 4" fill="#D4DBC9" strokeWidth="3" />
    <circle cx="183" cy="254" r="22" fill="#293C32" strokeWidth="3" />
    <circle cx="300" cy="254" r="24" fill="#293C32" strokeWidth="3" />
    <circle cx="183" cy="254" r="8" fill="#D2DAC6" strokeWidth="2" />
    <circle cx="300" cy="254" r="9" fill="#D2DAC6" strokeWidth="2" />
    <path d="M226 226h43m-42 10h38" strokeWidth="2" opacity=".7" />
  </g>
}

export default function RentalIllustration({ variant, compact = false }: { variant: RentalIllustrationKind; compact?: boolean }) {
  return <div className={`${styles.illustration} ${compact ? styles.compactIllustration : ''} ${variant === 'pack' ? styles.packIllustration : ''}`} aria-hidden="true">
    <svg viewBox="0 0 520 340" fill="none">
      <circle cx="263" cy="175" r="111" fill="currentColor" opacity=".035" />
      <path d="M89 292h342" stroke="currentColor" strokeWidth="1" opacity=".25" />
      <ellipse cx="259" cy="287" rx="116" ry="8" fill="currentColor" opacity=".06" />
      <g stroke="#667B57" strokeLinecap="round" strokeLinejoin="round">
        {variant === 'overseeding-tool' && <OverseedingTool />}
        {variant === 'compost-spreader' && <CompostSpreader />}
        {variant === 'battery-spreader' && <BatterySpreader />}
        {variant === 'rotary-spreader' && <RotarySpreader />}
        {variant === 'scarifier' && <Scarifier />}
        {variant === 'pack' && <><g transform="translate(-23 60) scale(.78)"><OverseedingTool /></g><g transform="translate(206 82) scale(.62)"><RotarySpreader /></g></>}
      </g>
      <path d="m94 290-3-16m3 16 6-11m312 13 4-18m-4 18-6-11" stroke="currentColor" strokeWidth="1.5" opacity=".5" />
    </svg>
    <span>Illustration d’usage</span>
  </div>
}
