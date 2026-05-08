import { defineStore } from 'pinia'

let applyHandler: (() => void) | null = null

interface UpdateState {
  updateAvailable: boolean
  isApplyingUpdate: boolean
}

export const useUpdateStore = defineStore('update', {
  state: (): UpdateState => ({
    updateAvailable: false,
    isApplyingUpdate: false,
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
    applyUpdate() {
      if (!this.updateAvailable || this.isApplyingUpdate)
        return
      if (!applyHandler)
        throw new Error('Update apply handler is not registered.')

      this.isApplyingUpdate = true
      applyHandler()
    },
  },
})
