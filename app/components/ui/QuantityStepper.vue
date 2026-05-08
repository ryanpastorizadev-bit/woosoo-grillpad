<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: number
  min?: number
  max?: number
  disabled?: boolean
}>(), {
  min: 0,
  max: Number.POSITIVE_INFINITY,
  disabled: false,
})

const emit = defineEmits<{
  decrement: []
  increment: []
}>()

const canDecrement = computed(() => !props.disabled && props.value > props.min)
const canIncrement = computed(() => !props.disabled && props.value < props.max)
</script>

<template>
  <div class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
    <AppButton variant="ghost" class="h-9 min-w-9 px-0" :disabled="!canDecrement" @click="emit('decrement')">
      −
    </AppButton>
    <span class="min-w-8 text-center text-sm font-semibold text-white">{{ value }}</span>
    <AppButton variant="ghost" class="h-9 min-w-9 px-0" :disabled="!canIncrement" @click="emit('increment')">
      +
    </AppButton>
  </div>
</template>
