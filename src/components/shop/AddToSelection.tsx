'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check, Minus, Plus } from 'lucide-react'
import { useShopSelection } from './ShopProvider'
import ShopFulfillmentNotice from './ShopFulfillmentNotice'
import type { ShopProduct } from '@/lib/shop-catalog'
import styles from './Shop.module.css'

export default function AddToSelection({ product }: { product: ShopProduct }) {
  const { add } = useShopSelection()
  const [quantity, setQuantity] = useState(1)
  const [formatId, setFormatId] = useState(product.formats[0].id)
  const [added, setAdded] = useState(false)
  return <div className={styles.addPanel}>
    <label className={styles.fieldLabel} htmlFor={`format-${product.id}`}>Format souhaité</label>
    <select id={`format-${product.id}`} value={formatId} onChange={event => { setFormatId(event.target.value); setAdded(false) }}>{product.formats.map(format => <option key={format.id} value={format.id}>{format.label}</option>)}</select>
    <div className={styles.quantityRow}><span>Nombre de conditionnements</span><div className={styles.quantity}>
      <button type="button" aria-label="Diminuer la quantité" disabled={quantity <= 1} onClick={() => { setQuantity(quantity - 1); setAdded(false) }}><Minus size={16} aria-hidden="true" /></button>
      <output aria-live="polite">{quantity}</output>
      <button type="button" aria-label="Augmenter la quantité" disabled={quantity >= 99} onClick={() => { setQuantity(quantity + 1); setAdded(false) }}><Plus size={16} aria-hidden="true" /></button>
    </div></div>
    <button type="button" className={styles.primaryButton} onClick={() => { add(product.id, formatId, quantity); setAdded(true) }}>{added ? <><Check size={18} aria-hidden="true" /> Ajouté à ma sélection</> : <>Ajouter à ma sélection <Plus size={18} aria-hidden="true" /></>}</button>
    <div aria-live="polite" className={styles.addedMessage}>{added && <Link href="/boutique/selection">Voir ma sélection et demander un tarif <ArrowUpRight size={15} aria-hidden="true" /></Link>}</div>
    <p className={styles.finePrint}>Ajout sans engagement. Prix des produits, poids du conditionnement et disponibilité seront confirmés avant toute commande.</p>
    <ShopFulfillmentNotice />
  </div>
}
