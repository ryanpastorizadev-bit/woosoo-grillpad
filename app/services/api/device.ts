import { z } from 'zod'
import { API_ENDPOINTS } from './endpoints'

const IdToStringSchema = z.union([z.string(), z.number()]).pipe(z.coerce.string())

const BroadcastingConfigSchema = z.object({
  key: z.string().optional(),
  host: z.string().optional(),
  port: z.number().optional(),
  scheme: z.string().optional(),
}).optional()

const DeviceRegistrationResponseSchema = z.object({
  success: z.boolean(),
  device: z.object({
    id: IdToStringSchema,
    name: z.string().optional().nullable(),
  }),
  token: z.string(),
  table: z.object({
    id: IdToStringSchema,
    name: z.string(),
  }),
  broadcasting: BroadcastingConfigSchema,
})

export type DeviceRegistrationResponse = z.infer<typeof DeviceRegistrationResponseSchema>

export interface RegisterDevicePayload extends Record<string, unknown> {
  token?: string
  security_code?: string
}

export function parseDeviceRegistrationResponse(payload: unknown): DeviceRegistrationResponse {
  return DeviceRegistrationResponseSchema.parse(payload)
}

export async function registerDevice(payload: RegisterDevicePayload) {
  const { api } = useApi()
  const response = await api(API_ENDPOINTS.device.register, { method: 'POST', body: payload })
  return parseDeviceRegistrationResponse(response)
}
