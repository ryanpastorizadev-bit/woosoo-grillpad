export type SessionPhase = 'unregistered' | 'package_selection' | 'initial_order' | 'review' | 'refill' | 'ended'

export interface PackageSummary {
  id: string
  name: string
  price: number
  description: string
}

export interface MenuItem {
  id: string
  name: string
  categoryId: string
  packageIds: string[]
  price: number
  imageUrl?: string
  availableForInitial: boolean
  availableForRefill: boolean
  refillGroup: 'side' | 'modifier' | 'none'
  isActive: boolean
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface OrderSessionState {
  sessionId: string | null
  tableId: string | null
  packageId: string | null
  phase: SessionPhase
  initialOrderId: string | null
  initialOrderSubmittedAt: string | null
}
