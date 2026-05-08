<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'md' | 'lg'
  class?: string
}>(), { variant: 'primary', size: 'md' })

const classes = computed(() => cn(
  'inline-flex items-center justify-center rounded-2xl font-semibold transition active:scale-[.98] disabled:pointer-events-none disabled:opacity-40',
  props.size === 'lg' ? 'h-16 px-8 text-lg' : 'h-12 px-5 text-sm',
  props.variant === 'primary' && 'bg-primary text-primary-foreground shadow-[0_12px_30px_rgba(246,181,109,.22)]',
  props.variant === 'ghost' && 'border border-white/10 bg-white/5 text-white hover:bg-white/10',
  props.variant === 'danger' && 'bg-red-500 text-white',
  props.class
))
</script>

<template>
  <button :class="classes">
    <slot />
  </button>
</template>
