<script setup lang="ts">
import { useServiceRequestsStore } from '~/stores/service-requests'

const serviceRequests = useServiceRequestsStore()

function toggle(type: Parameters<typeof serviceRequests.toggle>[0]) {
  serviceRequests.toggle(type)
}

function clearSelections() {
  serviceRequests.resetAll()
}
</script>

<template>
  <div class="fixed inset-x-6 bottom-6 z-40 rounded-[2rem] border border-white/10 bg-black/70 p-4 shadow-2xl backdrop-blur">
    <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div class="max-w-xl">
        <div class="flex items-center gap-3">
          <p class="text-xs font-semibold uppercase tracking-[.16em] text-primary/80">
            Service Requests
          </p>
          <AppBadge :variant="serviceRequests.hasSelection ? 'accent' : 'muted'">
            {{ serviceRequests.hasSelection ? `${serviceRequests.selectionCount} selected` : 'Preview only' }}
          </AppBadge>
        </div>
        <p class="mt-2 text-sm text-white/65">
          Choose what the table needs. Submission stays disabled until the backend service-request endpoint is ready.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <AppButton variant="ghost" :disabled="!serviceRequests.hasSelection" @click="clearSelections">
          Clear selection
        </AppButton>
        <AppButton :disabled="true">
          Submit coming soon
        </AppButton>
      </div>
    </div>
    <div class="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-5">
      <ServiceRequestButton
        v-for="item in serviceRequests.items"
        :key="item.type"
        :item="item"
        @toggle="toggle"
      />
    </div>
    <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4 text-xs text-white/50">
      <p>
        No live backend calls are made from this shell.
      </p>
      <p>
        Future integration can submit <span class="font-semibold text-white/70">serviceRequests.selectedTypes</span>.
      </p>
    </div>
  </div>
</template>
