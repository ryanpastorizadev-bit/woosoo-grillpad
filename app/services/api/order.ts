import type { CartItem } from '~/types/order'
import { deviceApiEndpoints } from '~/services/api/endpoints'
import {
  ActiveOrderSchema,
  CartItemPayloadSchema,
  OrderResponseSchema,
  type ApiActiveOrder,
  type ApiOrderSession,
} from '~/services/api/schemas'

export interface SubmitInitialOrderPayload {
  sessionId: string
  packageId: string
  items: CartItem[]
  guestCount?: number
}

export interface SubmitRefillOrderPayload {
  sessionId: string
  initialOrderId: string
  items: CartItem[]
}

export interface OrderSubmissionResult {
  order: ApiActiveOrder
  session?: ApiOrderSession
}

function mapCartItems(items: CartItem[]) {
  return items.map(item => CartItemPayloadSchema.parse({
    menuItemId: item.id,
    quantity: item.quantity,
    modifiers: [],
  }))
}

export async function submitInitialOrder(payload: SubmitInitialOrderPayload): Promise<OrderSubmissionResult> {
  const { api, parse } = useApi()
  const response = await api(deviceApiEndpoints.initialOrders, {
    method: 'POST',
    body: {
      sessionId: payload.sessionId,
      packageId: payload.packageId,
      guestCount: payload.guestCount,
      items: mapCartItems(payload.items),
    },
  })

  const parsed = parse(OrderResponseSchema, response)
  return { order: parsed.order, session: parsed.session }
}

export async function submitRefillOrder(payload: SubmitRefillOrderPayload): Promise<OrderSubmissionResult> {
  const { api, parse } = useApi()
  const response = await api(deviceApiEndpoints.refillOrders, {
    method: 'POST',
    body: {
      sessionId: payload.sessionId,
      initialOrderId: payload.initialOrderId,
      items: mapCartItems(payload.items),
    },
  })

  const parsed = parse(OrderResponseSchema, response)
  return { order: parsed.order, session: parsed.session }
}

export async function getActiveOrder(): Promise<ApiActiveOrder | null> {
  const { api, parse } = useApi()
  const response = await api(deviceApiEndpoints.activeOrder)

  if (response === null) return null
  return parse(ActiveOrderSchema.nullable(), response)
}
