<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const props = withDefaults(defineProps<{
  padding?: 'none' | 'sm' | 'md' | 'lg'
  class?: string
}>(), { padding: 'none' })

const classes = computed(() => cn(
  'gp-card',
  props.padding === 'sm' && 'p-4',
  props.padding === 'md' && 'p-6',
  props.padding === 'lg' && 'p-8',
  props.class,
))
</script>

<template>
  <div :class="classes" v-bind="$attrs">
    <slot />
  </div>
</template>
