import styles from './Simulator.module.css'

type Finish = 'natural' | 'manicured'
type Height = 'source' | 'short' | 'comfortable'
interface Props {
  finish: Finish
  height: Height
  disabled?: boolean
  onFinishChange: (value: Finish) => void
  onHeightChange: (value: Height) => void
}

export default function SimulationPreferences({ finish, height, disabled, onFinishChange, onHeightChange }: Props) {
  return <div className={styles.preferences}>
    <div className={styles.preferencesHeading}><h3>Personnalisez votre gazon</h3><span>Facultatif</span></div>
    <p>Deux choix pour imaginer votre pelouse. Les autres éléments du jardin sont à conserver.</p>
    <fieldset disabled={disabled}><legend>1. La finition</legend><div className={styles.finishOptions}>
      {([
        ['natural', 'Naturel', 'Un gazon dense, avec des nuances vivantes.'],
        ['manicured', 'Très soigné', 'Un aspect régulier, fin et soigneusement entretenu.'],
      ] as const).map(([value, label, description]) => <label key={value} className={styles.optionCard}>
        <input type="radio" name="finish" value={value} checked={finish === value} onChange={() => onFinishChange(value)} />
        <span><strong>{label}</strong><span>{description}</span></span>
      </label>)}
    </div></fieldset>
    <fieldset disabled={disabled}><legend>2. La hauteur de tonte</legend><div className={styles.optionRow}>
      {([['source', 'Selon ma photo'], ['short', 'Courte'], ['comfortable', 'Plus haute']] as const).map(([value, label]) => <label key={value}>
        <input type="radio" name="height" value={value} checked={height === value} onChange={() => onHeightChange(value)} />{label}
      </label>)}
    </div></fieldset>
    <p className={styles.optionsNote}>Ces choix concernent l’image. La hauteur adaptée à votre terrain se détermine lors du diagnostic.</p>
  </div>
}
