import { registerSW } from 'virtual:pwa-register'

let removeNetworkListeners: (() => void) | null = null

export default defineNuxtPlugin(() => {
  const update = useUpdateStore()

  const updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh() {
      update.markUpdateAvailable()
    },
  })

  update.registerApplyHandler(() => updateServiceWorker(true))
  update.setOnlineStatus(navigator.onLine)

  const onOnline = () => update.setOnlineStatus(true)
  const onOffline = () => update.setOnlineStatus(false)
  removeNetworkListeners?.()
  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)
  removeNetworkListeners = () => {
    window.removeEventListener('online', onOnline)
    window.removeEventListener('offline', onOffline)
  }

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      removeNetworkListeners?.()
      removeNetworkListeners = null
    })
  }
})
