import { defineStore } from 'pinia'
import type { CartItem, MenuItem } from '~/types/order'

type CartKind = 'initial' | 'refill'

interface CartState {
  initialCart: CartItem[]
  refillCart: CartItem[]
}

export function assertItemAllowedForCart(kind: CartKind, item: MenuItem) {
  if (kind === 'refill' && !item.availableForRefill) throw new Error('Item is not allowed during refill.')
  if (kind === 'initial' && !item.availableForInitial) throw new Error('Item is not allowed during initial order.')
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({ initialCart: [], refillCart: [] }),
  getters: {
    initialCount: state => state.initialCart.reduce((sum, item) => sum + item.quantity, 0),
    refillCount: state => state.refillCart.reduce((sum, item) => sum + item.quantity, 0),
    currentCart(state): CartItem[] {
      const session = useSessionStore()
      if (session.phase === 'refill') return state.refillCart
      if (session.phase === 'initial_order') return state.initialCart
      return []
    }
  },
  actions: {
    activeKind(): CartKind {
      const session = useSessionStore()
      if (session.phase === 'initial_order') return 'initial'
      if (session.phase === 'refill') return 'refill'
      throw new Error('Cart is not available for the current session phase.')
    },
    add(item: MenuItem) {
      const kind = this.activeKind()
      assertItemAllowedForCart(kind, item)
      const cart = kind === 'initial' ? this.initialCart : this.refillCart
      const existing = cart.find(row => row.id === item.id)
      if (existing) existing.quantity += 1
      else cart.push({ ...item, quantity: 1 })
    },
    remove(itemId: string) {
      const kind = this.activeKind()
      const key = kind === 'initial' ? 'initialCart' : 'refillCart'
      this[key] = this[key].filter(item => item.id !== itemId)
    },
    clearInitialCart() {
      this.initialCart = []
    },
    clearRefillCart() {
      this.refillCart = []
    },
    clear(kind?: CartKind | 'active') {
      if (kind === 'active') {
        this.clear(this.activeKind())
        return
      }
      if (!kind || kind === 'initial') this.clearInitialCart()
      if (!kind || kind === 'refill') this.clearRefillCart()
    }
  }
})
