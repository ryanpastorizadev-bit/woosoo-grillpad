<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const props = withDefaults(defineProps<{
  class?: string
}>(), {
  class: undefined,
})

const classes = computed(() => cn(
  'sticky bottom-4 z-20 mt-8 flex items-center justify-end gap-3 rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur',
  props.class,
))
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
