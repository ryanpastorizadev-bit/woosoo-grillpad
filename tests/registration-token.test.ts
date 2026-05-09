import { describe, expect, it } from 'vitest'
import { isValidRegistrationToken, normalizeRegistrationToken } from '~/utils/registration'

describe('registration token utilities', () => {
  it('keeps only the first six digits', () => {
    expect(normalizeRegistrationToken('12a34-56789')).toBe('123456')
  })

  it('allows incomplete numeric input while typing', () => {
    expect(normalizeRegistrationToken('123')).toBe('123')
  })

  it('accepts exactly six digits', () => {
    expect(isValidRegistrationToken('123456')).toBe(true)
  })

  it('rejects incomplete and non-numeric tokens', () => {
    expect(isValidRegistrationToken('12345')).toBe(false)
    expect(isValidRegistrationToken('12345a')).toBe(false)
  })
})
