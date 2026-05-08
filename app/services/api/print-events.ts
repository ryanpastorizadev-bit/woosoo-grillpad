import type { PrintEvent } from '~/types/order'
import { z } from 'zod'
import { API_ENDPOINTS } from './endpoints'

const PrintEventSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  type: z.string(),
  status: z.union([
    z.literal('pending'),
    z.literal('printed'),
    z.literal('acknowledged'),
    z.literal('failed'),
  ]),
  message: z.string().optional(),
  createdAt: z.string(),
  acknowledgedAt: z.string().nullable().optional(),
}) satisfies z.ZodType<PrintEvent>

export async function getPrintEvents(sessionId: string): Promise<PrintEvent[]> {
  const { api, parse } = useApi()
  const response = await api(API_ENDPOINTS.printEvents.list, { query: { sessionId } })
  return parse(z.array(PrintEventSchema), response)
}

export async function ackPrintEvent(eventId: string): Promise<PrintEvent> {
  const { api, parse } = useApi()
  const response = await api(API_ENDPOINTS.printEvents.acknowledge(eventId), { method: 'POST' })
  return parse(PrintEventSchema, response)
}
