'use client'

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { SHOP_PRODUCTS } from '@/lib/shop-catalog'

export type SelectionLine = { productId: string; formatId: string; quantity: number }
const storageKey = 'hanami:shop-selection:v1'
const selectionEvent = 'hanami:shop-selection-change'
let memorySnapshot = '[]'

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === storageKey || event.key === null) callback() }
  window.addEventListener('storage', onStorage)
  window.addEventListener(selectionEvent, callback)
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(selectionEvent, callback) }
}
function getSnapshot() {
  try { return window.localStorage.getItem(storageKey) ?? memorySnapshot } catch { return memorySnapshot }
}
function readSelection(raw: string): SelectionLine[] {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((line: unknown) => {
      if (!line || typeof line !== 'object') return []
      const item = line as Record<string, unknown>
      const product = SHOP_PRODUCTS.find(product => product.id === item.productId)
      if (!product || !product.formats.some(format => format.id === item.formatId) || typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1) return []
      return [{ productId: product.id, formatId: String(item.formatId), quantity: Math.min(99, item.quantity) }]
    })
  } catch { return [] }
}
function writeSelection(lines: SelectionLine[]) {
  memorySnapshot = JSON.stringify(lines)
  try { window.localStorage.setItem(storageKey, memorySnapshot) } catch { /* La sélection fonctionne en mémoire si le stockage est indisponible. */ }
  window.dispatchEvent(new Event(selectionEvent))
}

type SelectionContext = {
  lines: SelectionLine[]
  itemCount: number
  add: (productId: string, formatId: string, quantity: number) => void
  setQuantity: (productId: string, formatId: string, quantity: number) => void
  clear: () => void
}
const Context = createContext<SelectionContext | null>(null)

export default function ShopProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => '[]')
  const lines = useMemo(() => readSelection(raw), [raw])
  const value: SelectionContext = {
    lines, itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    add(productId, formatId, quantity) {
      if (!SHOP_PRODUCTS.some(product => product.id === productId && product.formats.some(format => format.id === formatId))) return
      const current = readSelection(getSnapshot())
      const existing = current.find(line => line.productId === productId && line.formatId === formatId)
      if (existing) existing.quantity = Math.min(99, existing.quantity + Math.max(1, Math.floor(quantity)))
      else current.push({ productId, formatId, quantity: Math.min(99, Math.max(1, Math.floor(quantity))) })
      writeSelection(current)
    },
    setQuantity(productId, formatId, quantity) {
      const current = readSelection(getSnapshot())
      writeSelection(current.flatMap(line => line.productId === productId && line.formatId === formatId ? quantity > 0 ? [{ ...line, quantity: Math.min(99, Math.max(1, Math.floor(quantity))) }] : [] : [line]))
    },
    clear() { writeSelection([]) },
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useShopSelection() {
  const context = useContext(Context)
  if (!context) throw new Error('La sélection doit être utilisée dans ShopProvider.')
  return context
}
