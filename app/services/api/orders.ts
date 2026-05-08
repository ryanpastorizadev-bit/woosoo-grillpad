import { z } from 'zod'

const SubmitInitialResponseSchema = z.object({
  orderId: z.string(),
})

const SubmitRefillResponseSchema = z.object({
  ok: z.boolean().optional(),
})

export interface OrderItemPayload {
  id: string
  quantity: number
}

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
  const response = await api('/orders/initial', { method: 'POST', body: payload })
  return parse(SubmitInitialResponseSchema, response)
}

export async function submitRefillOrder(payload: SubmitRefillOrderPayload) {
  const { api, parse } = useApi()
  const response = await api('/orders/refill', { method: 'POST', body: payload })
  return parse(SubmitRefillResponseSchema, response)
}
