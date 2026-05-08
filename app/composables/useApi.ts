import type { z } from 'zod'

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
      if (response.status === 401) {
        device.clearDevice()
        await navigateTo('/start')
      }
    },
  })

  function parse<T>(schema: z.ZodType<T>, payload: unknown): T {
    return schema.parse(payload)
  }

  return { api, parse }
}
