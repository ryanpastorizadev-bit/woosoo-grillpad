<script setup lang="ts">
const session = useSessionStore()
const update = useUpdateStore()
const visible = computed(() => update.isOffline || update.showReconnect)
const positionClass = computed(() => (session.isActive ? 'bottom-44' : 'bottom-6'))
const title = computed(() => (update.isOffline ? 'Offline' : 'Back online'))
const message = computed(() => update.isOffline
  ? 'Connection lost. Changes sync when the tablet reconnects.'
  : 'Connection restored. You can continue ordering.')
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
          {{ title }}
        </p>
        <p class="text-sm text-white/60">
          {{ message }}
        </p>
      </div>
      <GpButton v-if="update.showReconnect" variant="ghost" @click="update.clearReconnectStatus()">
        Dismiss
      </GpButton>
    </div>
  </div>
</template>
