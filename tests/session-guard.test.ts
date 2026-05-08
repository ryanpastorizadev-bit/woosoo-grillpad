import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { routeForPhase, validateRoute } from '~/composables/useSessionGuard'

describe('session route guard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('redirects protected routes to start when device is not registered', () => {
    const result = validateRoute('/order/initial', {
      phase: 'initial_order',
      isRegistered: false,
      initialCount: 0,
      isActive: false,
    })

    expect(result).toEqual({ allowed: false, redirectTo: '/start' })
  })

  it('redirects review route back to initial order before explicit review phase', () => {
    const result = validateRoute('/order/review', {
      phase: 'initial_order',
      isRegistered: true,
      initialCount: 1,
      isActive: true,
    })

    expect(result).toEqual({ allowed: false, redirectTo: '/order/initial' })
  })

  it('prevents review route when initial cart is empty', () => {
    const result = validateRoute('/order/review', {
      phase: 'review',
      isRegistered: true,
      initialCount: 0,
      isActive: true,
    })

    expect(result).toEqual({ allowed: false, redirectTo: '/order/initial' })
  })

  it('allows review route during review phase with initial cart items', () => {
    const result = validateRoute('/order/review', {
      phase: 'review',
      isRegistered: true,
      initialCount: 1,
      isActive: true,
    })

    expect(result).toEqual({ allowed: true })
  })

  it('allows refill route during refill phase', () => {
    const result = validateRoute('/order/refill', {
      phase: 'refill',
      isRegistered: true,
      initialCount: 1,
      isActive: true,
    })

    expect(result).toEqual({ allowed: true })
  })

  it('allows package route only during package selection', () => {
    expect(validateRoute('/package', {
      phase: 'package_selection',
      isRegistered: true,
      initialCount: 0,
      isActive: true,
    })).toEqual({ allowed: true })

    expect(validateRoute('/package', {
      phase: 'initial_order',
      isRegistered: true,
      initialCount: 1,
      isActive: true,
    })).toEqual({ allowed: false, redirectTo: '/order/initial' })
  })

  it('allows initial order route only during initial order phase', () => {
    expect(validateRoute('/order/initial', {
      phase: 'initial_order',
      isRegistered: true,
      initialCount: 0,
      isActive: true,
    })).toEqual({ allowed: true })

    expect(validateRoute('/order/initial', {
      phase: 'review',
      isRegistered: true,
      initialCount: 1,
      isActive: true,
    })).toEqual({ allowed: false, redirectTo: '/order/review' })
  })

  it('blocks refill route when phase is not refill', () => {
    const result = validateRoute('/order/refill', {
      phase: 'review',
      isRegistered: true,
      initialCount: 1,
      isActive: true,
    })

    expect(result).toEqual({ allowed: false, redirectTo: '/order/review' })
  })

  it('maps ended phase to session ended route', () => {
    expect(routeForPhase('ended')).toBe('/session/ended')
  })
})
