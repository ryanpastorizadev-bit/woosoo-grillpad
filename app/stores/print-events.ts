import { defineStore } from 'pinia'
import { ackPrintEvent, getPrintEvents } from '~/services/api/print-events'
import type { PrintEvent } from '~/types/order'

interface PrintEventsState {
  events: PrintEvent[]
  loading: boolean
  lastError: string | null
}

export const usePrintEventsStore = defineStore('print-events', {
  state: (): PrintEventsState => ({
    events: [],
    loading: false,
    lastError: null,
  }),
  getters: {
    pendingEvents: state => state.events.filter(event => event.status !== 'acknowledged'),
    hasPendingEvents: state => state.events.some(event => event.status !== 'acknowledged'),
  },
  actions: {
    async refresh(sessionId: string) {
      this.loading = true
      this.lastError = null
      try {
        this.events = await getPrintEvents(sessionId)
      }
      catch (error) {
        this.lastError = error instanceof Error ? error.message : 'Unable to load print events.'
      }
      finally {
        this.loading = false
      }
    },
    async acknowledge(eventId: string) {
      this.lastError = null
      try {
        const updated = await ackPrintEvent(eventId)
        const index = this.events.findIndex(event => event.id === eventId)
        if (index >= 0) this.events[index] = updated
        else this.events.unshift(updated)
      }
      catch (error) {
        this.lastError = error instanceof Error ? error.message : 'Unable to acknowledge print event.'
        throw error
      }
    },
    clear() {
      this.events = []
      this.loading = false
      this.lastError = null
    },
  },
})
