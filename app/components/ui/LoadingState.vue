<script setup lang="ts">
withDefaults(defineProps<{
  message?: string
}>(), {
  message: 'Loading...',
})
</script>

<template>
  <AppCard padding="md" class="text-center">
    <p class="text-sm text-white/60">
      {{ message }}
    </p>
  </AppCard>
</template>
