import { defineStore } from 'pinia'
import type { MenuItem, PackageSummary, SessionPhase } from '~/types/order'
import { fetchInitialMenu, fetchPackages, fetchRefillMenu } from '~/services/api/menu'

interface MenuState {
  packages: PackageSummary[]
  initialMenu: MenuItem[]
  refillMenu: MenuItem[]
  loading: boolean
  error: string | null
}

export function getVisibleMenuItems(phase: SessionPhase, state: MenuState, packageId: string | null): MenuItem[] {
  if (phase === 'initial_order') {
    return state.initialMenu.filter(item => {
      return item.isActive && item.availableForInitial && (!packageId || item.packageIds.includes(packageId))
    })
  }

  if (phase === 'refill') {
    return state.refillMenu.filter(item => {
      return item.isActive && item.availableForRefill && item.refillGroup !== 'none'
    })
  }

  return []
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    packages: [],
    initialMenu: [],
    refillMenu: [],
    loading: false,
    error: null
  }),
  getters: {
    visibleItems(state): MenuItem[] {
      const session = useSessionStore()
      return getVisibleMenuItems(session.phase, state, session.packageId)
    }
  },
  actions: {
    async loadPackages() {
      this.loading = true
      this.error = null
      try {
        this.packages = await fetchPackages()
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load packages.'
        throw error
      }
      finally {
        this.loading = false
      }
    },
    async loadInitialMenu(packageId: string) {
      this.loading = true
      this.error = null
      try {
        this.initialMenu = await fetchInitialMenu(packageId)
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load initial menu.'
        throw error
      }
      finally {
        this.loading = false
      }
    },
    async loadRefillMenu(sessionId: string) {
      this.loading = true
      this.error = null
      try {
        this.refillMenu = await fetchRefillMenu(sessionId)
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load refill menu.'
        throw error
      }
      finally {
        this.loading = false
      }
    }
  }
})
