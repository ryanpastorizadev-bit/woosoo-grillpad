<script setup lang="ts">
import type { ServiceRequestItem } from '~/stores/service-requests'
import { cn } from '~/utils/cn'

const props = defineProps<{
  item: ServiceRequestItem
}>()

const emit = defineEmits<{
  trigger: [type: ServiceRequestItem['type']]
  clear: [type: ServiceRequestItem['type']]
}>()

const isPending = computed(() => props.item.status === 'pending')

const classes = computed(() => cn(
  'min-h-12 min-w-34 rounded-2xl border px-4 py-2 text-sm font-semibold transition',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70',
  isPending.value && 'border-primary/40 bg-primary/15 text-primary',
  props.item.status === 'idle' && 'border-white/10 bg-white/5 text-white hover:bg-white/10',
  props.item.status === 'success' && 'border-emerald-300/40 bg-emerald-300/15 text-emerald-200',
  props.item.status === 'error' && 'border-red-300/40 bg-red-300/10 text-red-200',
))

function onPrimaryAction() {
  if (isPending.value)
    return
  emit('trigger', props.item.type)
}

function onClear() {
  emit('clear', props.item.type)
}
</script>

<template>
  <div class="space-y-1.5">
    <button :class="classes" :disabled="isPending" type="button" @click="onPrimaryAction">
      <span>{{ item.label }}</span>
      <span v-if="isPending" class="ml-2 text-xs opacity-80">Pending</span>
    </button>
    <div v-if="item.status !== 'idle'" class="flex items-center gap-2 text-xs text-white/70">
      <span>{{ item.message }}</span>
      <button class="underline decoration-dotted underline-offset-2" type="button" @click="onClear">
        Clear
      </button>
    </div>
  </div>
</template>
