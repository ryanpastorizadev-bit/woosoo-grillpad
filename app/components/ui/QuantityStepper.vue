<script setup lang="ts">
import { getNextStepValue } from '~/utils/quantity-stepper'

const props = withDefaults(defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}>(), {
  min: 0,
  max: Number.POSITIVE_INFINITY,
  step: 1,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const canDecrement = computed(() => !props.disabled && (props.modelValue - props.step) >= props.min)
const canIncrement = computed(() => !props.disabled && (props.modelValue + props.step) <= props.max)

function decrement() {
  if (!canDecrement.value)
    return
  emit('update:modelValue', getNextStepValue(props.modelValue, 'decrement', props))
}

function increment() {
  if (!canIncrement.value)
    return
  emit('update:modelValue', getNextStepValue(props.modelValue, 'increment', props))
}
</script>

<template>
  <div class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
    <AppButton variant="ghost" class="h-10 w-10 px-0" :disabled="!canDecrement" @click="decrement">
      -
    </AppButton>
    <span class="min-w-8 text-center text-lg font-bold">{{ modelValue }}</span>
    <AppButton variant="ghost" class="h-10 w-10 px-0" :disabled="!canIncrement" @click="increment">
      +
    </AppButton>
  </div>
</template>
