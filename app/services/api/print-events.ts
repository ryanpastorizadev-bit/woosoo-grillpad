import type { PrintEvent } from '~/types/order'
import { z } from 'zod'

const PrintEventSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  status: z.string(),
  acknowledgedAt: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
})

const AckPrintEventResponseSchema = z.object({
  ok: z.boolean().optional(),
  acknowledgedAt: z.string().nullable().optional(),
})

export async function getPrintEvents(sessionId: string): Promise<PrintEvent[]> {
  const { api, parse } = useApi()
  const response = await api('/print-events', { query: { sessionId } })
  return parse(z.array(PrintEventSchema), response)
}

export async function ackPrintEvent(printEventId: string): Promise<{ ok: boolean, acknowledgedAt: string | null }> {
  const { api, parse } = useApi()
  const response = await api(`/print-events/${printEventId}/ack`, { method: 'POST' })
  const payload = parse(AckPrintEventResponseSchema, response)
  return { ok: payload.ok ?? true, acknowledgedAt: payload.acknowledgedAt ?? null }
}
