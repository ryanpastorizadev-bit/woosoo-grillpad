<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: 'No items yet',
  description: '',
})
</script>

<template>
  <AppCard padding="md" class="text-center">
    <h2 class="text-2xl font-bold">
      {{ title }}
    </h2>
    <p v-if="description" class="mt-2 text-sm text-white/60">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </AppCard>
</template>
