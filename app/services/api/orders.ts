import { z } from 'zod'
import { API_ENDPOINTS } from './endpoints'
import { useApi } from '~/composables/useApi'

export const OrderItemPayloadSchema = z.object({
  id: z.string(),
  quantity: z.number().int().positive(),
})

const SubmitInitialResponseSchema = z.object({
  orderId: z.string(),
})

const SubmitRefillResponseSchema = z.object({
  ok: z.boolean().optional(),
  refillOrderId: z.string().optional(),
})

const ActiveOrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().int().positive(),
  status: z.string().optional(),
})
const ActiveOrderSchema = z.object({
  orderId: z.string(),
  sessionId: z.string(),
  packageId: z.string(),
  status: z.string(),
  items: z.array(ActiveOrderItemSchema),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type OrderItemPayload = z.infer<typeof OrderItemPayloadSchema>

export interface SubmitInitialOrderPayload extends Record<string, unknown> {
  sessionId: string
  packageId: string
  items: OrderItemPayload[]
}

export interface SubmitRefillOrderPayload extends Record<string, unknown> {
  sessionId: string
  initialOrderId: string
  items: OrderItemPayload[]
}

export async function submitInitialOrder(payload: SubmitInitialOrderPayload) {
  const { api, parse } = useApi()
  const response = await api(API_ENDPOINTS.orders.initial, { method: 'POST', body: payload })
  return parse(SubmitInitialResponseSchema, response)
}

export async function submitRefillOrder(payload: SubmitRefillOrderPayload) {
  const { api, parse } = useApi()
  const response = await api(API_ENDPOINTS.orders.refill, { method: 'POST', body: payload })
  return parse(SubmitRefillResponseSchema, response)
}

export async function getActiveOrder(sessionId: string) {
  const { api, parse } = useApi()
  const response = await api(API_ENDPOINTS.orders.active, { query: { sessionId } })
  return parse(ActiveOrderSchema.nullable(), response)
}
