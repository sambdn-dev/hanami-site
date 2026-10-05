import type { Metadata } from 'next'
import RentalCatalog from '@/components/rental/RentalCatalog'

export const metadata: Metadata = {
  title: 'Location de matériel pour gazon — Boutique Hanami',
  description: 'Louez le matériel adapté à votre gazon pour 24 h, 48 h ou un week-end. Landzie, épandeurs et scarificateur, avec un pack regarnissage modulable.',
}

export default function RentalPage() {
  return <RentalCatalog />
}
