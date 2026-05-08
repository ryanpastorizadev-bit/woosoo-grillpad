<script setup lang="ts">
const update = useUpdateStore()
const session = useSessionStore()
const visible = computed(() => update.updateAvailable && session.isActive)
</script>

<template>
  <div v-if="visible" class="fixed inset-x-6 bottom-6 z-50 rounded-2xl border border-primary/40 bg-panel/95 p-4 shadow-2xl backdrop-blur">
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="font-bold text-primary">Update ready</p>
        <p class="text-sm text-white/60">The new UI will apply after the current dining session ends.</p>
      </div>
      <GpButton variant="ghost" @click="update.clearUpdateAvailable()">Dismiss</GpButton>
    </div>
  </div>
</template>
