import type { PrintEvent } from '~/types/order'
import { defineStore } from 'pinia'
import { ackPrintEvent, getPrintEvents } from '~/services/api/print-events'

interface PrintEventsState {
  events: PrintEvent[]
  loading: boolean
  error: string | null
}

export function mergePrintEvents(existing: PrintEvent[], incoming: PrintEvent): PrintEvent[] {
  const index = existing.findIndex(event => event.id === incoming.id)
  if (index === -1)
    return [incoming, ...existing]
  const merged = [...existing]
  merged[index] = incoming
  return merged
}

export const usePrintEventsStore = defineStore('print-events', {
  state: (): PrintEventsState => ({
    events: [],
    loading: false,
    error: null,
  }),
  actions: {
    async refresh(sessionId: string) {
      this.loading = true
      this.error = null
      try {
        this.events = await getPrintEvents(sessionId)
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load print events.'
      }
      finally {
        this.loading = false
      }
    },
    async acknowledge(eventId: string) {
      this.error = null
      try {
        const result = await ackPrintEvent(eventId)
        this.events = this.events.map((event) => {
          if (event.id !== eventId)
            return event
          return {
            ...event,
            acknowledgedAt: result.acknowledgedAt || new Date().toISOString(),
          }
        })
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to acknowledge print event.'
      }
    },
    upsert(event: PrintEvent) {
      this.events = mergePrintEvents(this.events, event)
    },
    clear() {
      this.$patch({ events: [], loading: false, error: null })
    },
  },
})
