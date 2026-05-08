import { z } from 'zod'

const StartSessionResponseSchema = z.object({
  sessionId: z.string(),
  tableId: z.string(),
})

const SessionSnapshotSchema = z.object({
  sessionId: z.string(),
  tableId: z.string(),
  phase: z.union([
    z.literal('unregistered'),
    z.literal('package_selection'),
    z.literal('initial_order'),
    z.literal('refill'),
    z.literal('ended'),
  ]),
  packageId: z.string().nullable(),
  initialOrderId: z.string().nullable(),
  initialOrderSubmittedAt: z.string().nullable(),
})

export interface StartSessionPayload extends Record<string, unknown> {
  tableId: string
}

export async function startSession(payload: StartSessionPayload) {
  const { api, parse } = useApi()
  const response = await api('/session/start', { method: 'POST', body: payload })
  return parse(StartSessionResponseSchema, response)
}

export async function restoreSession() {
  const { api, parse } = useApi()
  const response = await api('/session/current')
  return parse(SessionSnapshotSchema, response)
}
