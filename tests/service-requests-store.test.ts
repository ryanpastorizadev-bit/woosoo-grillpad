import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useServiceRequestsStore } from '~/stores/service-requests'

describe('service requests store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with all requests idle', () => {
    const store = useServiceRequestsStore()

    expect(store.items).toHaveLength(5)
    expect(store.items.every(item => !item.selected)).toBe(true)
    expect(store.hasSelection).toBe(false)
    expect(store.backendReady).toBe(false)
    expect(store.selectedTypes).toEqual([])
  })

  it('toggles requests locally without creating fake success states', () => {
    const store = useServiceRequestsStore()

    const toggled = store.toggle('water')
    const item = store.items.find(request => request.type === 'water')

    expect(toggled).toBe(true)
    expect(item?.selected).toBe(true)
    expect(store.hasSelection).toBe(true)
    expect(store.selectionCount).toBe(1)
    expect(store.selectedTypes).toEqual(['water'])

    store.toggle('water')

    expect(item?.selected).toBe(false)
    expect(store.hasSelection).toBe(false)
  })

  it('supports multiple selections and clearing a single request', () => {
    const store = useServiceRequestsStore()
    store.toggle('billing')
    store.toggle('call_staff')

    expect(store.selectionCount).toBe(2)
    expect(store.selectedTypes).toEqual(['billing', 'call_staff'])

    const cleared = store.clear('billing')

    expect(cleared).toBe(true)
    expect(store.selectedTypes).toEqual(['call_staff'])
  })

  it('resets the full local selection state', () => {
    const store = useServiceRequestsStore()
    store.toggle('clean_table')
    store.toggle('extra_utensils')

    store.resetAll()

    expect(store.hasSelection).toBe(false)
    expect(store.items.every(item => !item.selected)).toBe(true)
  })
})
