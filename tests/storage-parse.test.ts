import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { parseDeviceState, useDeviceStore } from '~/stores/device'
import { parseSessionState, useSessionStore } from '~/stores/session'

describe('storage parsing', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('parses a valid persisted device state', () => {
    const value = parseDeviceState(JSON.stringify({
      token: 'token-1',
      deviceId: 'device-1',
      tableId: 'table-1',
      tableName: 'A1',
    }))

    expect(value.deviceId).toBe('device-1')
  })

  it('rejects invalid persisted session state payload', () => {
    expect(() => parseSessionState(JSON.stringify({
      sessionId: 'session-1',
      tableId: 'table-1',
      phase: 'invalid-phase',
      packageId: null,
      initialOrderId: null,
      initialOrderSubmittedAt: null,
    }))).toThrow()
  })

  it('parses valid persisted session state payload', () => {
    const value = parseSessionState(JSON.stringify({
      sessionId: 'session-1',
      tableId: 'table-1',
      phase: 'review',
      packageId: 'pkg-1',
      initialOrderId: null,
      initialOrderSubmittedAt: null,
    }))

    expect(value.phase).toBe('review')
  })

  it('rejects non-json persisted device payload', () => {
    expect(() => parseDeviceState('{invalid json')).toThrow()
  })

  it('hydrates stores from valid stored payloads', () => {
    const device = useDeviceStore()
    const session = useSessionStore()
    const parsedDevice = parseDeviceState(JSON.stringify({
      token: 'token-1',
      deviceId: 'device-1',
      tableId: 'table-1',
      tableName: 'A1',
    }))
    const parsedSession = parseSessionState(JSON.stringify({
      sessionId: 'session-1',
      tableId: 'table-1',
      packageId: 'pkg-1',
      phase: 'review',
      initialOrderId: null,
      initialOrderSubmittedAt: null,
    }))

    device.setDevice(parsedDevice)
    session.hydrate(parsedSession)

    expect(device.isRegistered).toBe(true)
    expect(session.phase).toBe('review')
  })

  it('invalid stored state payloads are rejected safely', () => {
    expect(() => parseDeviceState(JSON.stringify({
      token: 'token-1',
      deviceId: 'device-1',
      tableId: 123,
      tableName: 'A1',
    }))).toThrow()
    expect(() => parseSessionState(JSON.stringify({
      sessionId: 'session-1',
      tableId: 'table-1',
      packageId: null,
      phase: 'not-a-phase',
      initialOrderId: null,
      initialOrderSubmittedAt: null,
    }))).toThrow()
  })
})
