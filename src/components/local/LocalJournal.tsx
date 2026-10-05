import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, BookOpen } from 'lucide-react'
import { getAllArticles } from '@/lib/blog'
import styles from './LocalJournal.module.css'

export default function LocalJournal() {
  const articles = getAllArticles()
  const feature = articles.find(article => article.slug === 'arrosage-automatique-intelligent-rain-bird-aiper') ?? articles[0]
  const second = articles.find(article => article.slug === 'pourquoi-gazon-jaunit-ete' && article.slug !== feature?.slug) ?? articles.find(article => article.slug !== feature?.slug)
  if (!feature) return null

  return <section id="journal" className={styles.section} aria-labelledby="local-journal-title"><div className={styles.container}>
    <div className={styles.heading}><div><p className={styles.eyebrow}><BookOpen size={14} aria-hidden="true" /> LE JOURNAL HANAMI</p><h2 id="local-journal-title">Comprendre le gazon.<br /><em>Choisir les bons gestes.</em></h2></div><Link href="/blog">Tous les conseils agronomiques <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    <div className={styles.articles}>{[feature, second].filter(article => article !== undefined).map((article, index) => <article key={article.slug}><Link href={`/blog/${article.slug}`} className={`${styles.article} ${index === 0 ? styles.featured : ''}`}>
      {article.cover && <div className={styles.image}><Image src={article.cover} alt="" fill sizes="(max-width: 767px) 90vw, 25vw" /></div>}
      <div className={styles.copy}><p className={styles.meta}>{article.category} <span>· {article.readingMinutes} min de lecture</span></p><h3>{article.title}</h3><p className={styles.excerpt}>{article.excerpt}</p><span className={styles.read}>Lire l’article <ArrowUpRight size={16} aria-hidden="true" /></span></div>
    </Link></article>)}</div>
  </div></section>
}
