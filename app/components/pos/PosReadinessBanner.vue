<script setup lang="ts">
import type { PosReadinessState } from '~/services/api/pos-context'
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const props = defineProps<{
  state: PosReadinessState
  loading?: boolean
}>()

const config = computed(() => {
  if (props.state === 'ready') {
    return {
      label: 'POS Ready',
      description: 'Session and terminal are open. Ordering is allowed.',
      dot: 'bg-green-400',
      wrapper: 'border-green-400/30 bg-green-400/10 text-green-200',
    }
  }
  if (props.state === 'blocked') {
    return {
      label: 'POS Blocked',
      description: 'No open POS session or terminal. Ordering is currently unavailable.',
      dot: 'bg-red-400',
      wrapper: 'border-red-400/30 bg-red-400/10 text-red-200',
    }
  }
  return {
    label: 'POS Status Unknown',
    description: 'Unable to determine POS readiness. Backend may be unavailable.',
    dot: 'bg-white/30',
    wrapper: 'border-white/10 bg-white/5 text-white/60',
  }
})

const wrapperClass = computed(() =>
  cn('flex items-center gap-3 rounded-xl border px-4 py-3 text-sm', config.value.wrapper),
)
</script>

<template>
  <div :class="wrapperClass" role="status" :aria-label="`POS readiness: ${config.label}`">
    <span
      :class="cn('size-2.5 shrink-0 rounded-full', config.dot, state === 'ready' && 'animate-pulse')"
      aria-hidden="true"
    />
    <div class="min-w-0 flex-1">
      <p class="font-semibold leading-tight">
        {{ config.label }}
        <span v-if="loading" class="ml-1 opacity-60">(refreshing...)</span>
      </p>
      <p class="mt-0.5 text-xs opacity-75">
        {{ config.description }}
      </p>
    </div>
  </div>
</template>
