import { defineStore } from 'pinia'

interface OrderState {
  submitting: boolean
  lastError: string | null
}

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({ submitting: false, lastError: null }),
  actions: {
    startSubmitting() { this.$patch({ submitting: true, lastError: null }) },
    finishSubmitting() { this.$patch({ submitting: false }) },
    setError(message: string) { this.$patch({ lastError: message, submitting: false }) },
    clearOrderError() { this.$patch({ lastError: null }) },
  },
})
