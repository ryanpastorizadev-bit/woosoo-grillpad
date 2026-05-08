import { defineStore } from 'pinia'

let applyHandler: (() => void) | null = null

interface UpdateState {
  updateAvailable: boolean
  isApplyingUpdate: boolean
  isOffline: boolean
  showReconnect: boolean
}

export const useUpdateStore = defineStore('update', {
  state: (): UpdateState => ({
    updateAvailable: false,
    isApplyingUpdate: false,
    isOffline: false,
    showReconnect: false,
  }),
  actions: {
    registerApplyHandler(handler: () => void) {
      applyHandler = handler
    },
    markUpdateAvailable() {
      this.updateAvailable = true
    },
    clearUpdateAvailable() {
      this.updateAvailable = false
    },
    setOnlineStatus(isOnline: boolean) {
      const wasOffline = this.isOffline
      this.isOffline = !isOnline
      if (!isOnline) {
        this.showReconnect = false
        return
      }
      this.showReconnect = wasOffline
    },
    clearReconnectStatus() {
      this.showReconnect = false
    },
    applyUpdate() {
      if (!this.updateAvailable || this.isApplyingUpdate)
        return
      if (!applyHandler)
        throw new Error('Update apply handler is not registered.')

      this.isApplyingUpdate = true
      try {
        applyHandler()
      }
      finally {
        this.isApplyingUpdate = false
      }
    },
  },
})
