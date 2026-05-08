import { z } from 'zod'

export const NullableIsoDateSchema = z.string().datetime().nullable()

export const DeviceSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string().nullable().optional(),
})

export const TableSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
})

export const BroadcastingSchema = z.object({
  key: z.string(),
  host: z.string(),
  port: z.number(),
  scheme: z.string(),
}).partial()

export const SessionPhaseSchema = z.union([
  z.literal('unregistered'),
  z.literal('package_selection'),
  z.literal('initial_order'),
  z.literal('review'),
  z.literal('refill'),
  z.literal('ended'),
])

export const OrderSessionSchema = z.object({
  sessionId: z.union([z.string(), z.number()]).transform(String),
  tableId: z.union([z.string(), z.number()]).transform(String),
  packageId: z.union([z.string(), z.number()]).transform(String).nullable(),
  phase: SessionPhaseSchema,
  initialOrderId: z.union([z.string(), z.number()]).transform(String).nullable(),
  initialOrderSubmittedAt: NullableIsoDateSchema,
})

export const MenuItemSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
  categoryId: z.union([z.string(), z.number()]).transform(String),
  packageIds: z.array(z.union([z.string(), z.number()]).transform(String)),
  price: z.number(),
  imageUrl: z.string().optional(),
  availableForInitial: z.boolean(),
  availableForRefill: z.boolean(),
  refillGroup: z.union([z.literal('side'), z.literal('modifier'), z.literal('none')]),
  isActive: z.boolean(),
})

export const PackageSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
  price: z.number(),
  description: z.string(),
})

export const CartItemPayloadSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().int().positive(),
  modifiers: z.array(z.object({
    modifierId: z.string(),
    quantity: z.number().int().positive().default(1),
  })).default([]),
})

export const OrderStatusSchema = z.union([
  z.literal('pending'),
  z.literal('confirmed'),
  z.literal('preparing'),
  z.literal('ready'),
  z.literal('served'),
  z.literal('completed'),
  z.literal('voided'),
  z.literal('cancelled'),
])

export const ActiveOrderSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  sessionId: z.union([z.string(), z.number()]).transform(String),
  tableId: z.union([z.string(), z.number()]).transform(String),
  packageId: z.union([z.string(), z.number()]).transform(String).nullable(),
  status: OrderStatusSchema,
  total: z.number().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable().optional(),
})

export const PrintEventStatusSchema = z.union([
  z.literal('pending'),
  z.literal('printed'),
  z.literal('acknowledged'),
  z.literal('failed'),
])

export const PrintEventSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  orderId: z.union([z.string(), z.number()]).transform(String),
  status: PrintEventStatusSchema,
  printerName: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  acknowledgedAt: z.string().datetime().nullable().optional(),
})

export const DeviceRegistrationResponseSchema = z.object({
  success: z.boolean(),
  device: DeviceSchema,
  token: z.string(),
  table: TableSchema,
  broadcasting: BroadcastingSchema.optional(),
  session: OrderSessionSchema.optional(),
})

export const SessionResponseSchema = z.object({
  success: z.boolean().default(true),
  session: OrderSessionSchema,
})

export const OrderResponseSchema = z.object({
  success: z.boolean().default(true),
  order: ActiveOrderSchema,
  session: OrderSessionSchema.optional(),
})

export const PrintEventsResponseSchema = z.object({
  events: z.array(PrintEventSchema),
})

export type ApiDeviceRegistrationResponse = z.infer<typeof DeviceRegistrationResponseSchema>
export type ApiOrderSession = z.infer<typeof OrderSessionSchema>
export type ApiMenuItem = z.infer<typeof MenuItemSchema>
export type ApiPackageSummary = z.infer<typeof PackageSchema>
export type ApiActiveOrder = z.infer<typeof ActiveOrderSchema>
export type ApiPrintEvent = z.infer<typeof PrintEventSchema>
