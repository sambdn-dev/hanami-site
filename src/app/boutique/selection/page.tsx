import type { Metadata } from 'next'
import ShopSelection from '@/components/shop/ShopSelection'

export const metadata: Metadata = { title: 'Ma sélection — Boutique Hanami', description: 'Demandez un tarif et un conseil pour votre sélection de produits. Aucun paiement ni commande validée avant confirmation personnelle.' }

export default function SelectionPage() { return <main><ShopSelection /></main> }
