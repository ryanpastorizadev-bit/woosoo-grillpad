import { defineStore } from 'pinia'

export type ServiceRequestType = 'water'
  | 'billing'
  | 'call_staff'
  | 'clean_table'
  | 'extra_utensils'

export interface ServiceRequestItem {
  type: ServiceRequestType
  label: string
  detail: string
  selected: boolean
}

interface ServiceRequestsState {
  items: ServiceRequestItem[]
}

const DEFAULT_REQUESTS: ReadonlyArray<Pick<ServiceRequestItem, 'type' | 'label' | 'detail'>> = [
  { type: 'water', label: 'Water', detail: 'Fresh water refill' },
  { type: 'billing', label: 'Bill Request', detail: 'Ask for the check' },
  { type: 'call_staff', label: 'Call Staff', detail: 'Get help from the floor team' },
  { type: 'clean_table', label: 'Clean Table', detail: 'Clear plates and spills' },
  { type: 'extra_utensils', label: 'Extra Utensils', detail: 'Bring chopsticks or tongs' },
]

function freshItems(): ServiceRequestItem[] {
  return DEFAULT_REQUESTS.map(request => ({
    ...request,
    selected: false,
  }))
}

export const useServiceRequestsStore = defineStore('service-requests', {
  state: (): ServiceRequestsState => ({
    items: freshItems(),
  }),
  getters: {
    selectedItems: state => state.items.filter(item => item.selected),
    selectedTypes(): ServiceRequestType[] {
      return this.selectedItems.map(item => item.type)
    },
    hasSelection(): boolean {
      return this.selectedItems.length > 0
    },
    // Submit stays disabled until a real backend endpoint is introduced.
    backendReady(): boolean {
      return false
    },
    selectionCount(): number {
      return this.selectedItems.length
    },
  },
  actions: {
    toggle(type: ServiceRequestType) {
      const item = this.items.find(request => request.type === type)
      if (!item)
        return false

      item.selected = !item.selected
      return true
    },
    clear(type: ServiceRequestType) {
      const item = this.items.find(request => request.type === type)
      if (!item)
        return false

      item.selected = false
      return true
    },
    resetAll() {
      this.items = freshItems()
    },
  },
})
