import { describe, expect, it } from 'vitest'
import { parseDeviceState } from '~/stores/device'
import { parseSessionState } from '~/stores/session'

describe('storage parsing', () => {
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
})
