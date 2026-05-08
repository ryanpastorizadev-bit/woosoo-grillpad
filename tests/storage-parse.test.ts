import { describe, expect, it } from 'vitest'
import { parseDeviceRegistrationResponse } from '~/services/api/device'
import { mapRegistrationToDeviceState, parseDeviceState } from '~/stores/device'
import { parseSessionState } from '~/stores/session'

describe('storage parsing', () => {
  it('parses a valid persisted device state', () => {
    const value = parseDeviceState(JSON.stringify({
      token: 'token-1',
      deviceId: 'device-1',
      deviceName: 'kiosk-1',
      tableId: 'table-1',
      tableName: 'A1',
    }))

    expect(value.deviceId).toBe('device-1')
    expect(value.deviceName).toBe('kiosk-1')
  })

  it('parses legacy persisted device state without deviceName', () => {
    const value = parseDeviceState(JSON.stringify({
      token: 'token-1',
      deviceId: 'device-1',
      tableId: 'table-1',
      tableName: 'A1',
    }))

    expect(value.deviceName).toBeNull()
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
})

describe('device registration contract', () => {
  it('normalizes registration response ids into strings', () => {
    const response = parseDeviceRegistrationResponse({
      success: true,
      device: { id: 123, name: 'kiosk-5' },
      token: 'bearer-token',
      table: { id: 5, name: 'Table 5' },
      broadcasting: { key: 'app-key', host: '127.0.0.1', port: 8080, scheme: 'ws' },
    })

    expect(response.device.id).toBe('123')
    expect(response.table.id).toBe('5')
  })

  it('maps registration response into persisted device state', () => {
    const response = parseDeviceRegistrationResponse({
      success: true,
      device: { id: 123, name: 'kiosk-5' },
      token: 'bearer-token',
      table: { id: 5, name: 'Table 5' },
      broadcasting: { key: 'app-key', host: '127.0.0.1', port: 8080, scheme: 'ws' },
    })

    expect(mapRegistrationToDeviceState(response)).toEqual({
      token: 'bearer-token',
      deviceId: '123',
      deviceName: 'kiosk-5',
      tableId: '5',
      tableName: 'Table 5',
    })
  })

  it('rejects invalid registration response payloads', () => {
    expect(() => parseDeviceRegistrationResponse({
      success: true,
      device: { id: 123 },
      table: { id: 5, name: 'Table 5' },
    })).toThrow()
  })
})
