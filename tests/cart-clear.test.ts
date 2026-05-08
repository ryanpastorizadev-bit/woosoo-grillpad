import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCartStore } from '~/stores/cart'

describe('cart clearing behavior', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('clears only initial cart when requested', () => {
    const cart = useCartStore()
    cart.initialCart = [{ id: 'a', name: 'A', categoryId: 'cat', packageIds: ['p'], price: 0, availableForInitial: true, availableForRefill: false, refillGroup: 'none', isActive: true, quantity: 2 }]
    cart.refillCart = [{ id: 'b', name: 'B', categoryId: 'cat', packageIds: ['p'], price: 0, availableForInitial: false, availableForRefill: true, refillGroup: 'side', isActive: true, quantity: 1 }]

    cart.clear('initial')

    expect(cart.initialCart).toEqual([])
    expect(cart.refillCart.map(item => item.id)).toEqual(['b'])
  })
})
