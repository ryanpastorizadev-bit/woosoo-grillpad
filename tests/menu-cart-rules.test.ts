import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { assertItemAllowedForCart } from '~/stores/cart'
import { getVisibleMenuItems } from '~/stores/menu'
import { useCartStore } from '~/stores/cart'

describe('menu and cart workflow rules', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('hides non-refill entries from refill mode visibility', () => {
    const state = {
      packages: [],
      initialMenu: [],
      refillMenu: [
        {
          id: 'item-refill-ok',
          name: 'Kimchi',
          categoryId: 'side',
          packageIds: [],
          price: 0,
          availableForInitial: false,
          availableForRefill: true,
          refillGroup: 'side',
          isActive: true,
        },
        {
          id: 'item-refill-none',
          name: 'Locked',
          categoryId: 'main',
          packageIds: [],
          price: 0,
          availableForInitial: true,
          availableForRefill: true,
          refillGroup: 'none',
          isActive: true,
        },
        {
          id: 'item-refill-inactive',
          name: 'Inactive',
          categoryId: 'main',
          packageIds: [],
          price: 0,
          availableForInitial: true,
          availableForRefill: true,
          refillGroup: 'modifier',
          isActive: false,
        },
      ],
      loading: false,
      error: null,
    }

    const visible = getVisibleMenuItems('refill', state, null)
    expect(visible.map(item => item.id)).toEqual(['item-refill-ok'])
  })

  it('rejects adding non-refill items during refill phase', () => {
    expect(() => assertItemAllowedForCart('refill', {
      id: 'item-initial-only',
      name: 'Brisket',
      categoryId: 'meat',
      packageIds: ['pkg-1'],
      price: 0,
      availableForInitial: true,
      availableForRefill: false,
      refillGroup: 'none',
      isActive: true,
    })).toThrow('Item is not allowed during refill.')
  })

  it('clearInitialCart clears only initial cart', () => {
    const store = useCartStore()
    store.initialCart = [{
      id: 'initial-1',
      name: 'Item',
      categoryId: 'main',
      packageIds: [],
      price: 0,
      availableForInitial: true,
      availableForRefill: false,
      refillGroup: 'none',
      isActive: true,
      quantity: 2,
    }]
    store.refillCart = [{
      id: 'refill-1',
      name: 'Refill',
      categoryId: 'side',
      packageIds: [],
      price: 0,
      availableForInitial: false,
      availableForRefill: true,
      refillGroup: 'side',
      isActive: true,
      quantity: 1,
    }]

    store.clearInitialCart()

    expect(store.initialCart).toEqual([])
    expect(store.refillCart).toHaveLength(1)
  })

  it('clear without kind clears both carts', () => {
    const store = useCartStore()
    store.initialCart = [{
      id: 'initial-1',
      name: 'Item',
      categoryId: 'main',
      packageIds: [],
      price: 0,
      availableForInitial: true,
      availableForRefill: false,
      refillGroup: 'none',
      isActive: true,
      quantity: 1,
    }]
    store.refillCart = [{
      id: 'refill-1',
      name: 'Refill',
      categoryId: 'side',
      packageIds: [],
      price: 0,
      availableForInitial: false,
      availableForRefill: true,
      refillGroup: 'side',
      isActive: true,
      quantity: 1,
    }]

    store.clear()

    expect(store.initialCart).toEqual([])
    expect(store.refillCart).toEqual([])
  })
})
