import type { PackageSummary } from '~/types/order'
import { z } from 'zod'
import { API_ENDPOINTS } from './endpoints'

const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  categoryId: z.string(),
  packageIds: z.array(z.string()),
  price: z.number(),
  imageUrl: z.string().optional(),
  availableForInitial: z.boolean(),
  availableForRefill: z.boolean(),
  refillGroup: z.union([z.literal('side'), z.literal('modifier'), z.literal('none')]),
  isActive: z.boolean(),
})

const PackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
})

export type ApiMenuItem = z.infer<typeof MenuItemSchema>
export type ApiPackageSummary = z.infer<typeof PackageSchema>

export async function fetchPackages(): Promise<PackageSummary[]> {
  const { api, parse } = useApi()
  const response = await api(API_ENDPOINTS.menu.packages)
  return parse(z.array(PackageSchema), response)
}

export async function fetchInitialMenu(packageId: string): Promise<ApiMenuItem[]> {
  const { api, parse } = useApi()
  const response = await api(API_ENDPOINTS.menu.initial, { query: { packageId } })
  return parse(z.array(MenuItemSchema), response)
}

export async function fetchRefillMenu(sessionId: string): Promise<ApiMenuItem[]> {
  const { api, parse } = useApi()
  const response = await api(API_ENDPOINTS.menu.refill, { query: { sessionId } })
  return parse(z.array(MenuItemSchema), response)
}
