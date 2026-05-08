import { defineStore } from 'pinia'

export type ServiceRequestType = 'water'
  | 'billing'
  | 'call_staff'
  | 'clean_table'
  | 'extra_utensils'
  | 'napkins'

export type ServiceRequestStatus = 'idle' | 'pending' | 'success' | 'error'

export interface ServiceRequestItem {
  type: ServiceRequestType
  label: string
  status: ServiceRequestStatus
  message: string | null
  updatedAt: string | null
}

interface ServiceRequestsState {
  items: ServiceRequestItem[]
}

interface RequestOptions {
  autoResolve?: boolean
  succeed?: boolean
  delayMs?: number
}

const DEFAULT_REQUESTS: ReadonlyArray<Pick<ServiceRequestItem, 'type' | 'label'>> = [
  { type: 'water', label: 'Water' },
  { type: 'billing', label: 'Billing' },
  { type: 'call_staff', label: 'Call Staff' },
  { type: 'clean_table', label: 'Clean Table' },
  { type: 'extra_utensils', label: 'Extra Utensils' },
  { type: 'napkins', label: 'Napkins' },
]

function freshItems(): ServiceRequestItem[] {
  return DEFAULT_REQUESTS.map(request => ({
    ...request,
    status: 'idle',
    message: null,
    updatedAt: null,
  }))
}

export const useServiceRequestsStore = defineStore('service-requests', {
  state: (): ServiceRequestsState => ({
    items: freshItems(),
  }),
  getters: {
    hasPending: state => state.items.some(item => item.status === 'pending'),
  },
  actions: {
    request(type: ServiceRequestType, options: RequestOptions = {}) {
      const item = this.items.find(request => request.type === type)
      if (!item || item.status === 'pending')
        return false

      item.status = 'pending'
      item.message = 'Waiting for staff confirmation...'
      item.updatedAt = new Date().toISOString()

      if (options.autoResolve ?? true) {
        const delayMs = options.delayMs ?? 700
        const succeed = options.succeed ?? true
        setTimeout(() => {
          this.resolve(type, { succeed })
        }, delayMs)
      }

      return true
    },
    resolve(type: ServiceRequestType, options: { succeed?: boolean } = {}) {
      const item = this.items.find(request => request.type === type)
      if (!item)
        return false

      const succeed = options.succeed ?? true
      item.status = succeed ? 'success' : 'error'
      item.message = succeed ? 'Request sent. Staff has been notified.' : 'Request failed. Please try again.'
      item.updatedAt = new Date().toISOString()
      return true
    },
    clear(type: ServiceRequestType) {
      const item = this.items.find(request => request.type === type)
      if (!item)
        return false

      item.status = 'idle'
      item.message = null
      item.updatedAt = new Date().toISOString()
      return true
    },
    resetAll() {
      this.items = freshItems()
    },
  },
})
