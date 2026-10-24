export type LawnPoint = [number, number]
export type LawnPolygon = LawnPoint[]

export interface LawnSimulationJob {
  id: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  stage?: 'upload' | 'ready' | 'generation' | 'complete'
  width?: number
  height?: number
  createdAt: string
  expiresAt?: string
  error?: { code: string; message: string; retryable: boolean } | null
}

export function isSimulationJob(value: unknown): value is LawnSimulationJob {
  if (!value || typeof value !== 'object') return false
  const job = value as Partial<LawnSimulationJob>
  return typeof job.id === 'string'
    && /^[\da-f-]{36}$/i.test(job.id)
    && typeof job.status === 'string'
    && ['queued', 'running', 'completed', 'failed'].includes(job.status)
    && typeof job.createdAt === 'string'
}

export function simulationImage(id: string, kind: 'original' | 'result') {
  return `/api/gazon-simulations/${encodeURIComponent(id)}/image?kind=${kind}`
}
