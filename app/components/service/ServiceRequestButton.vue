<script setup lang="ts">
import type { ServiceRequestItem } from '~/stores/service-requests'
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const props = defineProps<{
  item: ServiceRequestItem
}>()

const emit = defineEmits<{
  toggle: [type: ServiceRequestItem['type']]
}>()

const classes = computed(() => cn(
  'min-h-24 w-full rounded-3xl border px-4 py-4 text-left text-sm font-semibold transition',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70',
  props.item.selected
    ? 'border-primary/40 bg-primary/12 text-white shadow-[0_18px_40px_rgba(246,181,109,0.12)]'
    : 'border-white/10 bg-white/5 text-white hover:bg-white/10',
))

function onToggle() {
  emit('toggle', props.item.type)
}
</script>

<template>
  <button :class="classes" :aria-pressed="item.selected" type="button" @click="onToggle">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-base font-bold">
          {{ item.label }}
        </p>
        <p class="mt-1 text-xs font-medium text-white/55">
          {{ item.detail }}
        </p>
      </div>
      <span
        class="inline-flex min-w-20 justify-center rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[.16em]"
        :class="item.selected ? 'border-primary/40 bg-primary/15 text-primary' : 'border-white/10 text-white/60'"
      >
        {{ item.selected ? 'Selected' : 'Select' }}
      </span>
    </div>
  </button>
</template>
