<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: 'Nothing here yet',
  description: 'No data is available right now.',
})
</script>

<template>
  <div class="gp-card p-6 text-center">
    <p class="text-lg font-semibold text-white">
      {{ title }}
    </p>
    <p class="mt-2 text-sm text-white/60">
      {{ description }}
    </p>
    <div v-if="$slots.actions" class="mt-5">
      <slot name="actions" />
    </div>
  </div>
</template>
