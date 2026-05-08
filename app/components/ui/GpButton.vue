<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'md' | 'lg'
  class?: string
}>(), { variant: 'primary', size: 'md' })
</script>

<template>
  <AppButton :variant="props.variant" :size="props.size" :class="props.class" v-bind="$attrs">
    <slot />
  </AppButton>
</template>
