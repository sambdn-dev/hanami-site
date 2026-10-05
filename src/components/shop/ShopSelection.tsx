'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { SHOP_PRODUCTS, SHOP_FULFILLMENT_OPTIONS, SHOP_FULFILLMENT_NOTE, formatShopPrice } from '@/lib/shop-catalog'
import { useShopSelection } from './ShopProvider'
import ShopFulfillmentNotice from './ShopFulfillmentNotice'
import styles from './Shop.module.css'

export default function ShopSelection() {
  const { lines, itemCount, setQuantity, clear } = useShopSelection()
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const selected = lines.flatMap(line => {
    const product = SHOP_PRODUCTS.find(product => product.id === line.productId)
    const format = product?.formats.find(format => format.id === line.formatId)
    return product && format ? [{ line, product, format }] : []
  })

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const notes = String(form.get('notes') ?? '').trim()
    const fulfillment = SHOP_FULFILLMENT_OPTIONS.find(option => option.id === form.get('fulfillment'))
    if (!selected.length && !notes) return
    const articles = selected.map(({ line, product, format }) => `${line.quantity} × ${product.brand} ${product.name} — ${format.label}`).join('\n')
    const message = [
      'Demande boutique — aucune commande validée.',
      articles ? `Sélection :\n${articles}` : 'Conseil sur le choix des produits demandé.',
      'Prix des produits TTC, formats et stock à confirmer avant accord.',
      fulfillment ? `${fulfillment.label} : ${formatShopPrice(fulfillment.priceTtcCents)} TTC. Zone et créneau à confirmer.` : 'Livraison ou retrait à convenir avec Hanami.',
      notes ? `Précisions : ${notes}` : '',
    ].filter(Boolean).join('\n\n')
    if (message.length > 1000) { setStatus('error'); return }
    const payload = new FormData()
    payload.append('data', JSON.stringify({
      fullName: String(form.get('fullName') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim(),
      postalCode: String(form.get('postalCode') ?? '').trim(),
      surface: String(form.get('surface') ?? '').trim(),
      requestType: 'Produits — demande de tarif',
      source: 'boutique', message,
    }))
    setStatus('sending')
    try {
      const response = await fetch('/api/contact', { method: 'POST', body: payload })
      if (!response.ok) throw new Error('Envoi indisponible')
      setStatus('success')
      clear()
    } catch { setStatus('error') }
  }

  if (status === 'success') return <div className={styles.success} role="status"><span><Check size={30} aria-hidden="true" /></span><p className={styles.eyebrow}>DEMANDE TRANSMISE</p><h1>On prépare<br /><em>la suite ensemble.</em></h1><p>Je reviens vers vous avec le tarif TTC, le format, la disponibilité et les conditions de livraison. Vous pourrez alors décider si cela vous convient.</p><p className={styles.finePrint}>Votre demande ne valide aucune commande. Aucun paiement n’a été effectué.</p><Link href="/boutique" className={styles.primaryButton}>Retour à la sélection <ArrowUpRight size={17} aria-hidden="true" /></Link></div>

  return <div className={styles.selectionPage}>
    <div className={styles.selectionHeading}><p className={styles.eyebrow}>VOTRE SÉLECTION / DEMANDE DE TARIF</p><h1>Les bons produits.<br /><em>Le bon échange.</em></h1><p>Envoyez-moi votre sélection. Je vérifie le format, le tarif et la disponibilité avant de vous proposer la suite.</p></div>
    <div className={styles.selectionLayout}>
      <section className={styles.selectionSummary} aria-labelledby="selection-title"><div className={styles.summaryHeading}><h2 id="selection-title">Ma sélection</h2><span>{itemCount} conditionnement{itemCount > 1 ? 's' : ''}</span></div>
        {selected.length ? <div className={styles.selectionLines}>{selected.map(({ line, product, format }) => <article key={`${product.id}-${format.id}`} className={styles.selectionItem}><div className={styles.miniArt}><ShoppingBag size={26} aria-hidden="true" /></div><div><span className={styles.itemBrand}>{product.brand}</span><h3><Link href={`/boutique/${product.slug}`}>{product.name}</Link></h3><p>{format.label}</p><strong>{formatShopPrice(format.priceTtcCents)}</strong><div className={styles.itemControls}><div className={styles.quantity}><button type="button" disabled={line.quantity <= 1 || status === 'sending'} aria-label={`Diminuer la quantité de ${product.name}`} onClick={() => setQuantity(product.id, format.id, line.quantity - 1)}><Minus size={15} aria-hidden="true" /></button><output aria-live="polite">{line.quantity}</output><button type="button" disabled={line.quantity >= 99 || status === 'sending'} aria-label={`Augmenter la quantité de ${product.name}`} onClick={() => setQuantity(product.id, format.id, line.quantity + 1)}><Plus size={15} aria-hidden="true" /></button></div><button type="button" className={styles.removeButton} disabled={status === 'sending'} aria-label={`Retirer ${product.name} de ma sélection`} onClick={() => setQuantity(product.id, format.id, 0)}><Trash2 size={16} aria-hidden="true" /></button></div></div></article>)}</div> : <div className={styles.emptySelection}><ShoppingBag size={34} aria-hidden="true" /><p>Votre sélection est encore vide.</p><Link href="/boutique">Explorer les semences <ArrowUpRight size={16} aria-hidden="true" /></Link><span>Vous pouvez aussi utiliser le formulaire pour demander conseil.</span></div>}
        <div className={styles.summaryNotice}><strong>Un tarif avant tout engagement.</strong><p>Prix des produits TTC, format et disponibilité seront confirmés personnellement. Aucune commande ni aucun paiement à cette étape.</p></div><ShopFulfillmentNotice /><Link href="/boutique" className={styles.continueLink}>Continuer ma sélection <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </section>
      <section className={styles.requestPanel} aria-labelledby="request-title"><p className={styles.eyebrow}>LE CONSEIL HANAMI, EN DIRECT</p><h2 id="request-title">Parlons de votre jardin.</h2><p>Vos coordonnées pour que je puisse vous répondre.</p><form onSubmit={submit}><fieldset disabled={status === 'sending'}><div className={styles.formGrid}>
        <label className={styles.fullField}>Nom et prénom <span>*</span><input name="fullName" autoComplete="name" required maxLength={80} placeholder="Votre nom" /></label>
        <label className={styles.fullField}>Email <span>*</span><input name="email" type="email" autoComplete="email" required maxLength={150} placeholder="vous@exemple.fr" /></label>
        <label>Téléphone<input name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="Facultatif" /></label>
        <label>Code postal<input name="postalCode" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{5}" maxLength={5} placeholder="Pour la livraison" /></label>
        <label className={styles.fullField}>Surface de gazon (m²)<input name="surface" type="number" min="1" max="100000" placeholder="Si vous la connaissez" /></label>
        <label className={styles.fullField}>Livraison ou retrait<select name="fulfillment" defaultValue="" aria-describedby="fulfillment-help"><option value="">À convenir avec Hanami</option>{SHOP_FULFILLMENT_OPTIONS.map(option => <option key={option.id} value={option.id}>{option.label} — {formatShopPrice(option.priceTtcCents)} TTC</option>)}</select><span id="fulfillment-help" className={styles.fieldHint}>{SHOP_FULFILLMENT_NOTE}</span></label>
        <label className={styles.fullField}>Votre besoin<textarea name="notes" required={!selected.length} maxLength={600} rows={4} placeholder="Lumière, usage du jardin, format recherché…" /><small>600 caractères maximum</small></label>
      </div><label className={styles.consent}><input type="checkbox" required /><span>J’accepte que Hanami utilise ces informations pour répondre à ma demande. <Link href="/mentions-legales">Confidentialité</Link></span></label><button type="submit" className={styles.primaryButton}>{status === 'sending' ? 'Envoi de votre demande…' : 'Demander mon tarif et mes conseils'}<ArrowUpRight size={17} aria-hidden="true" /></button></fieldset><p className={styles.formNotice}>Sans engagement · aucune commande validée</p>{status === 'error' && <div className={styles.error} role="alert"><strong>Votre demande n’a pas pu être transmise.</strong><p>Votre sélection est conservée. Vous pouvez réessayer ou <a href="https://wa.me/33667277614" target="_blank" rel="noopener noreferrer">contacter Hanami sur WhatsApp</a>.</p></div>}</form></section>
    </div>
  </div>
}
