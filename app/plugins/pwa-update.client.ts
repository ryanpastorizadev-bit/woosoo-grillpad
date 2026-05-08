import { registerSW } from 'virtual:pwa-register'

export default defineNuxtPlugin(() => {
  const session = useSessionStore()
  const update = useUpdateStore()

  const updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh() {
      update.markUpdateAvailable()
      if (!session.isActive) {
        update.applyUpdate()
      }
    },
  })

  update.registerApplyHandler(() => updateServiceWorker(true))

  watch(
    () => session.isActive,
    (isActive) => {
      if (!isActive && update.updateAvailable && !update.isApplyingUpdate) {
        update.applyUpdate()
      }
    },
    { immediate: true },
  )
})
