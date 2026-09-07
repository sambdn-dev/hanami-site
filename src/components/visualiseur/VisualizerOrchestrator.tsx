/**
 * VisualizerOrchestrator.tsx — Cerveau du Visualiseur IA (client island)
 *
 * Machine à états : idle → compressing → ready → generating → result | error.
 *
 * Règle de conversion : la 1ʳᵉ génération est OFFERTE (effet waouh sans
 * friction). Toute action suivante (régénérer, télécharger) exige l'email
 * via EmailGateDialog. Une fois débloqué, tout est libre (persisté en
 * localStorage).
 */

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { compressPhoto } from '@/lib/photo-utils'
import { track } from '@/lib/analytics'
import { currentSeason } from '@/lib/visualiseur/seasonPrompts'
import type { Season, VisualiserResponse } from '@/lib/visualiseur/types'
import UploadStep from './UploadStep'
import GeneratingStep from './GeneratingStep'
import ResultStep from './ResultStep'
import EmailGateDialog, { type GateReason } from './EmailGateDialog'

type Status = 'idle' | 'compressing' | 'ready' | 'generating' | 'result' | 'error'

const SESSION_KEY = 'hanami-visualiser-session'
const UNLOCK_KEY = 'hanami-visualiser-unlocked'

function makeId(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch {
    /* fallback below */
  }
  return `s-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
}

export default function VisualizerOrchestrator() {
  const [status, setStatus] = useState<Status>('idle')
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null)
  const [afterUrl, setAfterUrl] = useState<string | null>(null)
  const [isStub, setIsStub] = useState(false)
  const [error, setError] = useState('')
  const [generationCount, setGenerationCount] = useState(0)
  const [emailUnlocked, setEmailUnlocked] = useState(false)

  // Gate
  const [gateReason, setGateReason] = useState<GateReason | null>(null)
  const pendingAction = useRef<'generate' | 'download' | null>(null)

  const seasonRef = useRef<Season>('ete')
  const sessionIdRef = useRef<string>('')

  // Init session + saison + déverrouillage depuis localStorage.
  useEffect(() => {
    seasonRef.current = currentSeason(new Date())
    try {
      let sid = localStorage.getItem(SESSION_KEY)
      if (!sid) {
        sid = makeId()
        localStorage.setItem(SESSION_KEY, sid)
      }
      sessionIdRef.current = sid
      if (localStorage.getItem(UNLOCK_KEY)) setEmailUnlocked(true)
    } catch {
      sessionIdRef.current = makeId()
    }
  }, [])

  // ── Upload + compression ────────────────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    setError('')
    setStatus('compressing')
    try {
      const { dataUrl } = await compressPhoto(file)
      setBeforeUrl(dataUrl)
      setAfterUrl(null)
      setStatus('ready')
      track('visualizer_upload', { status: 'success' })
    } catch {
      setError("Cette image n'a pas pu être lue. Essayez une autre photo.")
      setStatus('error')
      track('visualizer_upload', { status: 'error' })
    }
  }, [])

  // ── Génération (le travail, sans contrôle de gate) ──────────────────────
  const doGenerate = useCallback(async () => {
    if (!beforeUrl) return
    setError('')
    setStatus('generating')
    try {
      const res = await fetch('/api/visualiser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: beforeUrl,
          season: seasonRef.current,
          sessionId: sessionIdRef.current,
        }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? 'Erreur serveur')
      }
      const data = (await res.json()) as VisualiserResponse
      setAfterUrl(data.image)
      setIsStub(Boolean(data.stub))
      setGenerationCount((c) => c + 1)
      setStatus('result')
      track('visualizer_generate', {
        status: 'success',
        season: seasonRef.current,
        stub: Boolean(data.stub),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'La génération a échoué.')
      setStatus('error')
      track('visualizer_generate', { status: 'error', season: seasonRef.current })
    }
  }, [beforeUrl])

  // ── Gate helpers ─────────────────────────────────────────────────────────
  const openGate = useCallback((reason: GateReason, action: 'generate' | 'download') => {
    pendingAction.current = action
    setGateReason(reason)
    track('visualizer_gate_shown', { trigger: reason })
  }, [])

  const doDownload = useCallback(() => {
    if (!afterUrl) return
    const a = document.createElement('a')
    a.href = afterUrl
    a.download = 'hanami-gazon.png'
    document.body.appendChild(a)
    a.click()
    a.remove()
    track('visualizer_download', { format: 'png' })
  }, [afterUrl])

  // Actions exposées à ResultStep (avec contrôle de gate)
  const requestGenerate = useCallback(() => {
    if (generationCount >= 1 && !emailUnlocked) {
      openGate('regenerate', 'generate')
      return
    }
    void doGenerate()
  }, [generationCount, emailUnlocked, openGate, doGenerate])

  const requestDownload = useCallback(() => {
    if (!emailUnlocked) {
      openGate('download', 'download')
      return
    }
    doDownload()
  }, [emailUnlocked, openGate, doDownload])

  const handleGateSuccess = useCallback(
    (email: string) => {
      setEmailUnlocked(true)
      try {
        localStorage.setItem(UNLOCK_KEY, email)
      } catch {
        /* stockage indisponible — on débloque quand même pour la session */
      }
      setGateReason(null)
      track('visualizer_lead', { status: 'success', season: seasonRef.current })

      const action = pendingAction.current
      pendingAction.current = null
      if (action === 'generate') void doGenerate()
      else if (action === 'download') doDownload()
    },
    [doGenerate, doDownload],
  )

  const reset = useCallback(() => {
    setBeforeUrl(null)
    setAfterUrl(null)
    setError('')
    setStatus('idle')
  }, [])

  // ── Rendu ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto">
      {status === 'idle' && <UploadStep onFile={handleFile} />}

      {status === 'compressing' && (
        <div className="text-center py-16 text-stone-500">
          <div className="inline-block w-8 h-8 rounded-full border-4 border-hanami-100 border-t-hanami-600 animate-spin mb-4" />
          <p className="text-sm">Préparation de votre photo…</p>
        </div>
      )}

      {status === 'ready' && beforeUrl && (
        <div className="text-center">
          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm max-w-xl mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={beforeUrl} alt="Votre pelouse" className="w-full h-auto" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
            <button
              type="button"
              onClick={requestGenerate}
              className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-hanami-700 text-white font-medium text-sm hover:bg-hanami-900 transition-colors cursor-pointer"
            >
              Générer mon gazon de rêve ✨
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md text-stone-500 font-medium text-sm hover:text-hanami-700 transition-colors cursor-pointer"
            >
              Changer de photo
            </button>
          </div>
        </div>
      )}

      {status === 'generating' && <GeneratingStep />}

      {status === 'result' && beforeUrl && afterUrl && (
        <ResultStep
          beforeSrc={beforeUrl}
          afterSrc={afterUrl}
          stub={isStub}
          onDownload={requestDownload}
          onRegenerate={requestGenerate}
          onNewPhoto={reset}
        />
      )}

      {status === 'error' && (
        <div className="text-center py-12 px-6 max-w-lg mx-auto">
          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6">
            <p className="text-stone-700 font-medium">Oups, un souci est survenu.</p>
            <p className="text-stone-500 text-sm mt-2">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
              <button
                type="button"
                onClick={beforeUrl ? () => void doGenerate() : reset}
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-hanami-700 text-white font-medium text-sm hover:bg-hanami-900 transition-colors cursor-pointer"
              >
                Réessayer
              </button>
              <a
                href="https://wa.me/33667277614?text=Bonjour%20Hanami%2C%20j%27ai%20un%20souci%20avec%20le%20visualiseur%20IA."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-stone-200 text-stone-800 font-medium text-sm hover:border-hanami-500 hover:text-hanami-700 transition-colors bg-white"
              >
                Nous écrire sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {gateReason && (
        <EmailGateDialog
          reason={gateReason}
          beforeImage={beforeUrl}
          afterImage={afterUrl}
          season={seasonRef.current}
          onClose={() => setGateReason(null)}
          onSuccess={handleGateSuccess}
        />
      )}
    </div>
  )
}
