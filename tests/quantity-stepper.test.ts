import { describe, expect, it } from 'vitest'
import { getNextStepValue } from '~/utils/quantity-stepper'

describe('quantity stepper helper', () => {
  it('increments by step within bounds', () => {
    expect(getNextStepValue(2, 'increment', { min: 0, max: 10, step: 2 })).toBe(4)
  })

  it('decrements by step within bounds', () => {
    expect(getNextStepValue(4, 'decrement', { min: 0, max: 10, step: 2 })).toBe(2)
  })

  it('clamps at minimum and maximum', () => {
    expect(getNextStepValue(0, 'decrement', { min: 0, max: 10, step: 2 })).toBe(0)
    expect(getNextStepValue(10, 'increment', { min: 0, max: 10, step: 2 })).toBe(10)
  })
})
