<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: 'Loading…',
  description: 'Please wait while we prepare your screen.',
})
</script>

<template>
  <div class="gp-card flex items-center gap-4 p-6" role="status" aria-live="polite">
    <span class="h-4 w-4 animate-spin rounded-full border-2 border-primary/35 border-t-primary" />
    <div>
      <p class="font-semibold text-white">
        {{ title }}
      </p>
      <p class="text-sm text-white/60">
        {{ description }}
      </p>
    </div>
  </div>
</template>
