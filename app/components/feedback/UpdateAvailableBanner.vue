<script setup lang="ts">
const update = useUpdateStore()
const session = useSessionStore()
const visible = computed(() => update.updateAvailable)
const positionClass = computed(() => {
  const hasNetworkBanner = update.isOffline || update.showReconnect
  if (session.isActive) {
    return hasNetworkBanner ? 'bottom-60' : 'bottom-44'
  }
  return hasNetworkBanner ? 'bottom-24' : 'bottom-6'
})
const message = computed(() => session.isActive
  ? 'The new UI will apply after the current dining session ends.'
  : 'Reload is safe now. No active dining session will be interrupted.')
</script>

<template>
  <div
    v-if="visible"
    :class="positionClass"
    class="fixed inset-x-6 z-50 rounded-2xl border border-primary/40 bg-panel/95 p-4 shadow-2xl backdrop-blur"
  >
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="font-bold text-primary">
          Update ready
        </p>
        <p class="text-sm text-white/60">
          {{ message }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <GpButton v-if="!session.isActive" variant="primary" @click="update.applyUpdate()">
          Reload now
        </GpButton>
        <GpButton variant="ghost" @click="update.clearUpdateAvailable()">
          Dismiss
        </GpButton>
      </div>
    </div>
  </div>
</template>
