import type { PackageSummary } from '~/types/order'
import { deviceApiEndpoints } from '~/services/api/endpoints'
import { MenuItemSchema, PackageSchema, type ApiMenuItem } from '~/services/api/schemas'
import { z } from 'zod'

export type { ApiMenuItem, ApiPackageSummary } from '~/services/api/schemas'

export async function fetchPackages(): Promise<PackageSummary[]> {
  const { api, parse } = useApi()
  const response = await api(deviceApiEndpoints.packages)
  return parse(z.array(PackageSchema), response)
}

export async function fetchInitialMenu(packageId: string): Promise<ApiMenuItem[]> {
  const { api, parse } = useApi()
  const response = await api(deviceApiEndpoints.initialMenu, { query: { packageId } })
  return parse(z.array(MenuItemSchema), response)
}

export async function fetchRefillMenu(sessionId: string): Promise<ApiMenuItem[]> {
  const { api, parse } = useApi()
  const response = await api(deviceApiEndpoints.refillMenu, { query: { sessionId } })
  return parse(z.array(MenuItemSchema), response)
}
