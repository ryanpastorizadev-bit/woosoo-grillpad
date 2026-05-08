<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const props = withDefaults(defineProps<{
  variant?: 'accent' | 'muted'
  class?: string
}>(), { variant: 'muted' })

const classes = computed(() => cn(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
  props.variant === 'accent' && 'bg-primary/15 text-primary border border-primary/25',
  props.variant === 'muted' && 'bg-white/5 text-white/70 border border-white/10',
  props.class
))
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
