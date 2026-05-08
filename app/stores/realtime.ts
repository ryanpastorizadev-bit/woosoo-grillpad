import { defineStore } from 'pinia'

type RealtimeState = 'idle' | 'connecting' | 'connected' | 'disconnected'

interface RealtimeStoreState {
  connectionState: RealtimeState
  subscribedSessionId: string | null
}

export function nextRealtimeSubscription(current: string | null, incoming: string | null): string | null {
  if (!incoming)
    return null
  if (current === incoming)
    return current
  return incoming
}

export const useRealtimeStore = defineStore('realtime', {
  state: (): RealtimeStoreState => ({
    connectionState: 'idle',
    subscribedSessionId: null,
  }),
  actions: {
    markConnecting(sessionId: string) {
      this.$patch({ connectionState: 'connecting', subscribedSessionId: sessionId })
    },
    markConnected() {
      this.connectionState = 'connected'
    },
    markDisconnected() {
      this.connectionState = 'disconnected'
    },
    bindSession(sessionId: string) {
      const next = nextRealtimeSubscription(this.subscribedSessionId, sessionId)
      const changed = next !== this.subscribedSessionId
      this.subscribedSessionId = next
      return changed
    },
    unbindSession() {
      this.$patch({ subscribedSessionId: null, connectionState: 'idle' })
    },
  },
})
