import { describe, expect, it } from 'vitest'
import { canSubmitInitialOrder, canSubmitRefillOrder } from '~/utils/submission'

describe('submission guards', () => {
  it('blocks duplicate initial submission', () => {
    expect(canSubmitInitialOrder(true, 'session-1', 'pkg-1', 2)).toBe(false)
  })

  it('blocks duplicate refill submission', () => {
    expect(canSubmitRefillOrder(true, 'session-1', 'order-1', 1)).toBe(false)
  })

  it('requires initial submission prerequisites', () => {
    expect(canSubmitInitialOrder(false, null, 'pkg-1', 1)).toBe(false)
    expect(canSubmitInitialOrder(false, 'session-1', 'pkg-1', 0)).toBe(false)
    expect(canSubmitInitialOrder(false, 'session-1', 'pkg-1', 1)).toBe(true)
  })

  it('requires refill submission prerequisites', () => {
    expect(canSubmitRefillOrder(false, null, 'order-1', 1)).toBe(false)
    expect(canSubmitRefillOrder(false, 'session-1', null, 1)).toBe(false)
    expect(canSubmitRefillOrder(false, 'session-1', 'order-1', 1)).toBe(true)
  })
})
