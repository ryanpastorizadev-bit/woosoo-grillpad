import { describe, expect, it } from 'vitest'
import { routeForPhase, validateRoute } from '~/composables/useSessionGuard'

describe('session route guard', () => {
  it('redirects protected routes to start when device is not registered', () => {
    const result = validateRoute('/order/initial', {
      phase: 'initial_order',
      isRegistered: false,
      initialCount: 0,
      isActive: false,
    })

    expect(result).toEqual({ allowed: false, redirectTo: '/start' })
  })

  it('prevents review route when initial cart is empty', () => {
    const result = validateRoute('/order/review', {
      phase: 'initial_order',
      isRegistered: true,
      initialCount: 0,
      isActive: true,
    })

    expect(result).toEqual({ allowed: false, redirectTo: '/order/initial' })
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

  it('maps ended phase to session ended route', () => {
    expect(routeForPhase('ended')).toBe('/session/ended')
  })
})
