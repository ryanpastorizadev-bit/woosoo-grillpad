<script setup lang="ts">
const serviceRequests = useServiceRequestsStore()

function trigger(type: Parameters<typeof serviceRequests.request>[0]) {
  serviceRequests.request(type)
}

function clear(type: Parameters<typeof serviceRequests.clear>[0]) {
  serviceRequests.clear(type)
}
</script>

<template>
  <section
    aria-label="Service requests"
    class="fixed inset-x-6 bottom-6 z-40 rounded-2xl border border-white/10 bg-black/60 p-3 shadow-2xl backdrop-blur"
    role="region"
  >
    <div class="mb-2 flex items-center justify-between">
      <p class="text-xs font-semibold uppercase tracking-[.16em] text-primary/80">
        Service Requests
      </p>
      <AppBadge :variant="serviceRequests.hasPending ? 'accent' : 'muted'" aria-live="polite">
        {{ serviceRequests.hasPending ? 'Pending request' : 'Ready' }}
      </AppBadge>
    </div>
    <div class="grid grid-cols-3 gap-2 xl:grid-cols-6">
      <ServiceRequestButton
        v-for="item in serviceRequests.items"
        :key="item.type"
        :item="item"
        @trigger="trigger"
        @clear="clear"
      />
    </div>
  </section>
</template>
