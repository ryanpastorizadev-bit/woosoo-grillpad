import type { ActiveOrder } from '~/types/order'
import { z } from 'zod'
import { useApi } from '~/composables/useApi'

const ActiveOrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  status: z.string().nullable().optional(),
})

const ActiveOrderSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  tableId: z.string(),
  status: z.string(),
  items: z.array(ActiveOrderItemSchema),
  submittedAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
})

export async function getActiveOrder(sessionId: string): Promise<ActiveOrder> {
  const { api, parse } = useApi()
  const response = await api('/orders/active', { query: { sessionId } })
  return parse(ActiveOrderSchema, response)
}
