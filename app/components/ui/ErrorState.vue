<script setup lang="ts">
const props = withDefaults(defineProps<{
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
      {{ props.title }}
    </p>
    <p class="mt-2 text-sm text-red-100/80">
      {{ props.message }}
    </p>
    <div v-if="props.retryable || $slots.default" class="mt-5 flex items-center gap-3">
      <AppButton v-if="props.retryable" variant="ghost" @click="emit('retry')">
        {{ props.retryLabel }}
      </AppButton>
      <slot />
    </div>
  </div>
</template>
