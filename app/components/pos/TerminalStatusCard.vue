<script setup lang="ts">
import type { PosReadinessResponse } from '~/services/api/pos-context'

defineProps<{
  readiness: PosReadinessResponse
}>()

function formatDate(iso: string | null | undefined) {
  if (!iso)
    return '—'
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}
</script>

<template>
  <div class="gp-card space-y-3 p-5">
    <p class="text-xs font-semibold uppercase tracking-widest text-white/40">
      POS Session
    </p>

    <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
      <div>
        <p class="text-xs text-white/45">
          Session ID
        </p>
        <p class="font-mono font-semibold text-white/90">
          {{ readiness.posSessionId ?? '—' }}
        </p>
      </div>
      <div>
        <p class="text-xs text-white/45">
          Opened At
        </p>
        <p class="font-semibold text-white/90">
          {{ formatDate(readiness.openedAt) }}
        </p>
      </div>
    </div>

    <template v-if="readiness.terminal">
      <hr class="border-white/8">
      <p class="text-xs font-semibold uppercase tracking-widest text-white/40">
        Terminal
      </p>

      <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div>
          <p class="text-xs text-white/45">
            ID / Name
          </p>
          <p class="font-semibold text-white/90">
            {{ readiness.terminal.name }}
            <span class="ml-1 font-mono text-xs text-white/40">({{ readiness.terminal.id }})</span>
          </p>
        </div>
        <div>
          <p class="text-xs text-white/45">
            Status
          </p>
          <p
            class="font-semibold capitalize"
            :class="readiness.terminal.status.toLowerCase() === 'open' ? 'text-green-300' : 'text-red-300'"
          >
            {{ readiness.terminal.status }}
          </p>
        </div>
      </div>

      <div v-if="readiness.terminal.blockingReason" class="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
        <span class="font-semibold">Blocking reason:</span> {{ readiness.terminal.blockingReason }}
      </div>
    </template>
  </div>
</template>
