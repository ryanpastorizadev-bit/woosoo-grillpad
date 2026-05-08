import type { ActiveOrder } from '~/types/order'
import { defineStore } from 'pinia'
import { getActiveOrder } from '~/services/api/active-order'

interface ActiveOrderState {
  data: ActiveOrder | null
  loading: boolean
  error: string | null
}

export const useActiveOrderStore = defineStore('active-order', {
  state: (): ActiveOrderState => ({
    data: null,
    loading: false,
    error: null,
  }),
  actions: {
    async refresh(sessionId: string) {
      this.loading = true
      this.error = null
      try {
        this.data = await getActiveOrder(sessionId)
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load active order.'
      }
      finally {
        this.loading = false
      }
    },
    clear() {
      this.$patch({ data: null, loading: false, error: null })
    },
  },
})
