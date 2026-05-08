<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const props = withDefaults(defineProps<{
  class?: string
}>(), {
  class: undefined,
})

const classes = computed(() => cn('gp-card', props.class))
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
