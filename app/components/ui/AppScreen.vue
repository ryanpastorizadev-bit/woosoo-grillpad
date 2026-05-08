<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const props = withDefaults(defineProps<{
  width?: 'md' | 'lg' | 'xl' | 'full'
  class?: string
}>(), { width: 'xl' })

const classes = computed(() => cn(
  'mx-auto w-full py-8',
  props.width === 'md' && 'max-w-4xl',
  props.width === 'lg' && 'max-w-6xl',
  props.width === 'xl' && 'max-w-7xl',
  props.width === 'full' && 'max-w-none',
  props.class,
))
</script>

<template>
  <section :class="classes" v-bind="$attrs">
    <slot />
  </section>
</template>
