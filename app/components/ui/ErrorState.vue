<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  message: string
  retryLabel?: string
}>(), {
  title: 'Something went wrong',
  retryLabel: undefined,
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <AppCard padding="md" class="border-red-300/30 bg-red-300/5">
    <h2 class="text-xl font-bold text-red-200">
      {{ title }}
    </h2>
    <p class="mt-2 text-sm text-red-100/90">
      {{ message }}
    </p>
    <AppButton v-if="retryLabel" class="mt-4" variant="ghost" @click="emit('retry')">
      {{ retryLabel }}
    </AppButton>
    <div class="mt-4">
      <slot />
    </div>
  </AppCard>
</template>
