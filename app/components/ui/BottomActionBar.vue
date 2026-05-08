<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const props = withDefaults(defineProps<{
  class?: string
}>(), {
  class: '',
})

const classes = computed(() => cn(
  'fixed inset-x-6 bottom-24 z-30 rounded-2xl border border-white/10 bg-black/70 p-3 shadow-2xl backdrop-blur',
  props.class,
))
</script>

<template>
  <div :class="classes">
    <div class="flex items-center justify-between gap-3">
      <slot />
    </div>
  </div>
</template>
