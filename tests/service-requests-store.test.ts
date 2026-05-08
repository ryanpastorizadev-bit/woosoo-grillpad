import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useServiceRequestsStore } from '~/stores/service-requests'

describe('service requests store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with all requests idle', () => {
    const store = useServiceRequestsStore()

    expect(store.items).toHaveLength(6)
    expect(store.items.every(item => item.status === 'idle')).toBe(true)
    expect(store.hasPending).toBe(false)
  })

  it('marks request as pending then auto-resolves to success', () => {
    vi.useFakeTimers()
    const store = useServiceRequestsStore()

    const triggered = store.request('water', { autoResolve: true, delayMs: 300 })
    const item = store.items.find(request => request.type === 'water')

    expect(triggered).toBe(true)
    expect(item?.status).toBe('pending')
    expect(store.hasPending).toBe(true)

    vi.advanceTimersByTime(350)

    expect(item?.status).toBe('success')
    expect(store.hasPending).toBe(false)
    vi.useRealTimers()
  })

  it('rejects duplicate request while pending', () => {
    const store = useServiceRequestsStore()
    const first = store.request('billing', { autoResolve: false })
    const second = store.request('billing', { autoResolve: false })

    expect(first).toBe(true)
    expect(second).toBe(false)
  })

  it('supports error resolution and clear', () => {
    const store = useServiceRequestsStore()
    store.request('call_staff', { autoResolve: false })

    store.resolve('call_staff', { succeed: false })
    let item = store.items.find(request => request.type === 'call_staff')
    expect(item?.status).toBe('error')

    store.clear('call_staff')
    item = store.items.find(request => request.type === 'call_staff')
    expect(item?.status).toBe('idle')
    expect(item?.message).toBeNull()
  })
})
