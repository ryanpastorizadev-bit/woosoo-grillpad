import type { SessionPhase } from '~/types/order'

interface GuardResult {
  allowed: boolean
  redirectTo?: string
}

interface SessionGuardState {
  phase: SessionPhase
  isRegistered: boolean
  initialCount: number
  isActive: boolean
}

export function routeForPhase(phase: SessionPhase): string {
  if (phase === 'package_selection') return '/package'
  if (phase === 'initial_order') return '/order/initial'
  if (phase === 'refill') return '/order/refill'
  return '/start'
}

export function validateRoute(path: string, state: SessionGuardState): GuardResult {
  if (path === '/start') return { allowed: true }

  if (!state.isRegistered) {
    return { allowed: false, redirectTo: '/start' }
  }

  if (path === '/package') {
    return state.phase === 'package_selection'
      ? { allowed: true }
      : { allowed: false, redirectTo: routeForPhase(state.phase) }
  }

  if (path === '/order/initial') {
    return state.phase === 'initial_order'
      ? { allowed: true }
      : { allowed: false, redirectTo: routeForPhase(state.phase) }
  }

  if (path === '/order/review') {
    if (state.phase !== 'initial_order') return { allowed: false, redirectTo: routeForPhase(state.phase) }
    if (state.initialCount <= 0) return { allowed: false, redirectTo: '/order/initial' }
    return { allowed: true }
  }

  if (path === '/order/refill') {
    return state.phase === 'refill'
      ? { allowed: true }
      : { allowed: false, redirectTo: routeForPhase(state.phase) }
  }

  if (path === '/session') {
    return state.isActive
      ? { allowed: true }
      : { allowed: false, redirectTo: routeForPhase(state.phase) }
  }

  if (path === '/session/ended') {
    return state.phase === 'ended'
      ? { allowed: true }
      : { allowed: false, redirectTo: routeForPhase(state.phase) }
  }

  return { allowed: true }
}

export function useSessionGuard() {
  const session = useSessionStore()
  const device = useDeviceStore()
  const cart = useCartStore()

  const validateCurrentRoute = (path: string): GuardResult => validateRoute(path, {
    phase: session.phase,
    isRegistered: device.isRegistered,
    initialCount: cart.initialCount,
    isActive: session.isActive
  })

  return {
    routeForPhase,
    validateRoute: validateCurrentRoute
  }
}
