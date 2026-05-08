import { defineStore } from 'pinia'
import { z } from 'zod'
import type { OrderSessionState, SessionPhase } from '~/types/order'

const SESSION_STORAGE_KEY = 'grillpad:session'
const SessionPhaseSchema = z.union([
  z.literal('unregistered'),
  z.literal('package_selection'),
  z.literal('initial_order'),
  z.literal('review'),
  z.literal('refill'),
  z.literal('ended'),
])
const SessionStateSchema = z.object({
  sessionId: z.string().nullable(),
  tableId: z.string().nullable(),
  packageId: z.string().nullable(),
  phase: SessionPhaseSchema,
  initialOrderId: z.string().nullable(),
  initialOrderSubmittedAt: z.string().nullable(),
})

function persistSessionState(state: OrderSessionState) {
  if (!import.meta.client) return
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state))
}

export function parseSessionState(raw: string): OrderSessionState {
  return SessionStateSchema.parse(JSON.parse(raw))
}

export const useSessionStore = defineStore('session', {
  state: (): OrderSessionState => ({
    sessionId: null,
    tableId: null,
    packageId: null,
    phase: 'unregistered',
    initialOrderId: null,
    initialOrderSubmittedAt: null,
  }),
  getters: {
    canChoosePackage: state => state.phase === 'package_selection',
    canInitialOrder: state => state.phase === 'initial_order',
    canReview: state => state.phase === 'review',
    canRefill: state => state.phase === 'refill' && Boolean(state.initialOrderId),
    isActive: state => !['unregistered', 'ended'].includes(state.phase),
  },
  actions: {
    start(tableId: string, sessionId: string) {
      this.$patch({ tableId, sessionId, phase: 'package_selection' })
      persistSessionState(this.$state)
    },
    setPackage(packageId: string) {
      if (this.phase !== 'package_selection') throw new Error('Package can only be selected before initial order.')
      this.$patch({ packageId, phase: 'initial_order' })
      persistSessionState(this.$state)
    },
    enterReview() {
      if (this.phase !== 'initial_order') throw new Error('Review is only available after initial order selection.')
      this.$patch({ phase: 'review' })
      persistSessionState(this.$state)
    },
    returnToInitialOrder() {
      if (this.phase !== 'review') throw new Error('Can only return to initial order from review.')
      this.$patch({ phase: 'initial_order' })
      persistSessionState(this.$state)
    },
    enterRefillMode(orderId: string) {
      this.$patch({ phase: 'refill', initialOrderId: orderId, initialOrderSubmittedAt: new Date().toISOString() })
      persistSessionState(this.$state)
    },
    markInitialOrderSubmitted(orderId: string) {
      if (!['initial_order', 'review'].includes(this.phase)) throw new Error('Initial order can only be submitted during initial order or review phase.')
      this.$patch({ phase: 'refill', initialOrderId: orderId, initialOrderSubmittedAt: new Date().toISOString() })
      persistSessionState(this.$state)
    },
    hydrate(payload: OrderSessionState) {
      this.$patch(payload)
      persistSessionState(this.$state)
    },
    restoreFromStorage() {
      if (!import.meta.client) return false
      const raw = localStorage.getItem(SESSION_STORAGE_KEY)
      if (!raw) return false
      try {
        const parsed = parseSessionState(raw)
        this.$patch(parsed)
        return true
      }
      catch {
        localStorage.removeItem(SESSION_STORAGE_KEY)
        this.$reset()
        return false
      }
    },
    forcePhase(phase: SessionPhase) {
      this.phase = phase
      persistSessionState(this.$state)
    },
    end() {
      this.$patch({ phase: 'ended' })
      persistSessionState(this.$state)
    },
    reset() {
      this.$reset()
      persistSessionState(this.$state)
    },
  },
})
