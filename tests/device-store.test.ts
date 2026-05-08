import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useDeviceStore } from '~/stores/device'

describe('device store persistence behavior', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('tracks registration from persisted-identifying fields', () => {
    const store = useDeviceStore()
    expect(store.isRegistered).toBe(false)

    store.setDevice({
      token: 'token-1',
      deviceId: 'device-1',
      tableId: 'table-1',
      tableName: 'A1',
    })

    expect(store.isRegistered).toBe(true)
  })

  it('returns false when restoreFromStorage runs in non-client environment', () => {
    const store = useDeviceStore()
    store.setDevice({
      token: 'token-1',
      deviceId: 'device-1',
      tableId: 'table-1',
      tableName: 'A1',
    })

    const restored = store.restoreFromStorage()

    expect(restored).toBe(false)
    expect(store.deviceId).toBe('device-1')
  })

  it('clearDevice resets persisted device state fields', () => {
    const store = useDeviceStore()
    store.setDevice({
      token: 'token-1',
      deviceId: 'device-1',
      tableId: 'table-1',
      tableName: 'A1',
    })

    store.clearDevice()

    expect(store.isRegistered).toBe(false)
    expect(store.token).toBeNull()
    expect(store.deviceId).toBeNull()
    expect(store.tableId).toBeNull()
    expect(store.tableName).toBeNull()
  })
})
