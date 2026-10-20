import { notFound, redirect } from 'next/navigation'

const legacyNames: Record<string, string> = { 'barenbrug-pro-ombre': 'PRO OMBRE', 'barenbrug-pro-24p': 'PRO 24P' }

export default async function LegacyProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const name = legacyNames[(await params).slug]
  if (!name) notFound()
  redirect(`/boutique?recherche=1&q=${encodeURIComponent(name)}`)
}
