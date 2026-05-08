import { z } from 'zod'
import { API_ENDPOINTS } from './endpoints'

const BroadcastingConfigSchema = z.object({
  key: z.string().optional(),
  host: z.string().optional(),
  port: z.number().optional(),
  scheme: z.string().optional(),
}).optional()

const DeviceRegistrationResponseSchema = z.object({
  success: z.boolean(),
  device: z.object({
    id: z.union([z.string(), z.number()]).transform(String),
    name: z.string().optional().nullable(),
  }),
  token: z.string(),
  table: z.object({
    id: z.union([z.string(), z.number()]).transform(String),
    name: z.string(),
  }),
  broadcasting: BroadcastingConfigSchema,
})

export interface RegisterDevicePayload extends Record<string, unknown> {
  token?: string
  security_code?: string
}

export async function registerDevice(payload: RegisterDevicePayload) {
  const { api, parse } = useApi()
  const response = await api(API_ENDPOINTS.device.register, { method: 'POST', body: payload })
  return parse(DeviceRegistrationResponseSchema, response)
}
