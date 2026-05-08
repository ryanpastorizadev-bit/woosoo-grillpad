import { describe, expect, it } from 'vitest'
import { assertItemAllowedForCart } from '~/stores/cart'
import { getVisibleMenuItems } from '~/stores/menu'

describe('menu and cart workflow rules', () => {
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
})
