import { deviceApiEndpoints } from '~/services/api/endpoints'
import {
  DeviceRegistrationResponseSchema,
  SessionResponseSchema,
  type ApiDeviceRegistrationResponse,
  type ApiOrderSession,
} from '~/services/api/schemas'

export interface RegisterDevicePayload {
  token?: string
  security_code?: string
}

export interface StartSessionPayload {
  deviceId: string
  tableId: string
}

export interface RestoreSessionPayload {
  sessionId?: string | null
  deviceId?: string | null
}

export async function registerDevice(payload: RegisterDevicePayload): Promise<ApiDeviceRegistrationResponse> {
  const { api, parse } = useApi()
  const response = await api(deviceApiEndpoints.register, {
    method: 'POST',
    body: payload,
  })

  return parse(DeviceRegistrationResponseSchema, response)
}

export async function startSession(payload: StartSessionPayload): Promise<ApiOrderSession> {
  const { api, parse } = useApi()
  const response = await api(deviceApiEndpoints.startSession, {
    method: 'POST',
    body: payload,
  })

  return parse(SessionResponseSchema, response).session
}

export async function restoreSession(payload: RestoreSessionPayload = {}): Promise<ApiOrderSession> {
  const { api, parse } = useApi()
  const response = await api(deviceApiEndpoints.restoreSession, {
    method: 'POST',
    body: payload,
  })

  return parse(SessionResponseSchema, response).session
}
