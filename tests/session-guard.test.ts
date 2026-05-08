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

  it('redirects package route to current phase route when package selection is complete', () => {
    const result = validateRoute('/package', {
      phase: 'initial_order',
      isRegistered: true,
      initialCount: 1,
      isActive: true,
    })

    expect(result).toEqual({ allowed: false, redirectTo: '/order/initial' })
  })

  it('blocks active session route when session is not active', () => {
    const result = validateRoute('/session', {
      phase: 'ended',
      isRegistered: true,
      initialCount: 1,
      isActive: false,
    })

    expect(result).toEqual({ allowed: false, redirectTo: '/session/ended' })
  })

  it('blocks session ended route before ended phase', () => {
    const result = validateRoute('/session/ended', {
      phase: 'refill',
      isRegistered: true,
      initialCount: 1,
      isActive: true,
    })

    expect(result).toEqual({ allowed: false, redirectTo: '/order/refill' })
  })

  it('maps ended phase to session ended route', () => {
    expect(routeForPhase('ended')).toBe('/session/ended')
  })
})
