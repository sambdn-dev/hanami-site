/** Keep configuration failures separate from temporary network failures. */
export class SimulationServiceError extends Error {
  constructor(message: string, readonly retryable: boolean) {
    super(message)
    this.name = 'SimulationServiceError'
  }
}

export function simulationServiceError(status: number, detail: Record<string, unknown> | null, fallback?: string) {
  const configurationRequired = ['SIMULATION_CONFIGURATION_REQUIRED', 'SIMULATION_PREVIEW_ACCESS_REQUIRED', 'SIMULATION_UNAVAILABLE'].includes(String(detail?.code))
  const message = typeof detail?.message === 'string' ? detail.message : fallback || 'Le service est momentanément indisponible. Votre demande n’a pas été confirmée.'
  return new SimulationServiceError(message, !configurationRequired && (status >= 500 || status === 408 || status === 429))
}
