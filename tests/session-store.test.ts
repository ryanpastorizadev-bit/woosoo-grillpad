import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSessionStore } from '~/stores/session'

describe('session store transitions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('moves package selection to initial order after package set', () => {
    const store = useSessionStore()
    store.start('table-1', 'session-1')

    store.setPackage('pkg-1')

    expect(store.phase).toBe('initial_order')
    expect(store.packageId).toBe('pkg-1')
  })

  it('allows entering review from initial order and back', () => {
    const store = useSessionStore()
    store.start('table-1', 'session-1')
    store.setPackage('pkg-1')

    store.enterReview()
    expect(store.phase).toBe('review')

    store.returnToInitialOrder()
    expect(store.phase).toBe('initial_order')
  })

  it('marks initial submission from review as refill', () => {
    const store = useSessionStore()
    store.start('table-1', 'session-1')
    store.setPackage('pkg-1')
    store.enterReview()

    store.markInitialOrderSubmitted('order-1')

    expect(store.phase).toBe('refill')
    expect(store.initialOrderId).toBe('order-1')
    expect(store.initialOrderSubmittedAt).toBeTypeOf('string')
  })

  it('rejects selecting package outside package selection phase', () => {
    const store = useSessionStore()
    store.start('table-1', 'session-1')
    store.setPackage('pkg-1')

    expect(() => store.setPackage('pkg-2')).toThrow('Package can only be selected before initial order.')
  })

  it('supports entering refill mode and ending/resetting session', () => {
    const store = useSessionStore()
    store.start('table-1', 'session-1')
    store.setPackage('pkg-1')
    store.enterRefillMode('order-1')

    expect(store.canRefill).toBe(true)
    expect(store.phase).toBe('refill')

    store.end()
    expect(store.phase).toBe('ended')
    expect(store.isActive).toBe(false)

    store.reset()
    expect(store.phase).toBe('unregistered')
    expect(store.sessionId).toBeNull()
  })
})
