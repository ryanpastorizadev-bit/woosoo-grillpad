import { describe, expect, it } from 'vitest'
import { nextRealtimeSubscription } from '~/stores/realtime'

describe('realtime subscription helper', () => {
  it('keeps existing subscription when incoming is unchanged', () => {
    expect(nextRealtimeSubscription('session-1', 'session-1')).toBe('session-1')
  })

  it('switches subscription when incoming session changes', () => {
    expect(nextRealtimeSubscription('session-1', 'session-2')).toBe('session-2')
  })

  it('clears subscription when incoming session is empty', () => {
    expect(nextRealtimeSubscription('session-1', null)).toBeNull()
  })
})
