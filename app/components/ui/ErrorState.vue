<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  message?: string
  retryLabel?: string
  retryable?: boolean
}>(), {
  title: 'Something went wrong',
  message: 'Please try again.',
  retryLabel: 'Retry',
  retryable: false,
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="gp-card border-red-300/40 bg-red-500/8 p-6">
    <p class="font-semibold text-red-200">
      {{ title }}
    </p>
    <p class="mt-2 text-sm text-red-100/80">
      {{ message }}
    </p>
    <div v-if="retryable || $slots.default" class="mt-5 flex items-center gap-3">
      <AppButton v-if="retryable" variant="ghost" @click="emit('retry')">
        {{ retryLabel }}
      </AppButton>
      <slot />
    </div>
  </div>
</template>
