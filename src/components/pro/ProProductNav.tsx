import Link from 'next/link'
import styles from './ProEditorial.module.css'

export default function ProProductNav({ active }: { active: 'pro' | 'studio' }) {
  return (
    <nav className={styles.productNav} aria-label="Solutions professionnelles Hanami">
      <Link href="/pro" aria-current={active === 'pro' ? 'page' : undefined} className={active === 'pro' ? styles.productActive : ''}>
        <span>Hanami</span><strong>PRO</strong>
      </Link>
      <Link href="/pro/studio" aria-current={active === 'studio' ? 'page' : undefined} className={active === 'studio' ? styles.productActive : ''}>
        <span>Hanami Studio</span><strong>PRO</strong>
      </Link>
    </nav>
  )
}
