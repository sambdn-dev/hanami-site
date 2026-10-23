'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}
const clientRoot = () => document.body
const serverRoot = () => null

export function usePortalRoot() {
  return useSyncExternalStore<HTMLElement | null>(subscribe, clientRoot, serverRoot)
}
