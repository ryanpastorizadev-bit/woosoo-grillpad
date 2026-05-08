import type { z } from 'zod'

interface ApiErrorPayload {
  message?: string
  error?: string
  code?: string
}

export class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status = 500, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

function readApiErrorMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object')
    return undefined
  const data = payload as ApiErrorPayload
  return data.message || data.error
}

export function useApi() {
  const config = useRuntimeConfig()
  const device = useDeviceStore()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    retry: 1,
    timeout: 12000,
    headers: { Accept: 'application/json' },
    onRequest({ options }) {
      if (device.token) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Bearer ${device.token}`)
      }
    },
    async onResponseError({ response }) {
      const message = readApiErrorMessage(response._data) || 'Request failed.'
      const code = typeof response._data === 'object' && response._data && 'code' in response._data
        ? String(response._data.code)
        : undefined
      if (response.status === 401) {
        device.clearDevice()
        await navigateTo('/start')
      }
      throw new ApiError(message, response.status, code)
    },
  })

  function parse<T>(schema: z.ZodType<T>, payload: unknown): T {
    const parsed = schema.safeParse(payload)
    if (!parsed.success)
      throw new ApiError('Backend payload validation failed.', 500, 'INVALID_API_PAYLOAD')
    return parsed.data
  }

  return { api, parse }
}
