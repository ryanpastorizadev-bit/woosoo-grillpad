<script setup lang="ts">
definePageMeta({ middleware: ['session-phase'] })

const session = useSessionStore()
const activeOrder = useActiveOrderStore()
const printEvents = usePrintEventsStore()
const realtime = useRealtimeStore()

async function loadSessionData() {
  const sessionId = session.sessionId
  if (!sessionId)
    return
  await Promise.all([
    activeOrder.refresh(sessionId),
    printEvents.refresh(sessionId),
  ])
}

onMounted(async () => {
  await loadSessionData()
})

function endSession() {
  activeOrder.clear()
  printEvents.clear()
  realtime.unbindSession()
  session.end()
  navigateTo('/session/ended')
}

async function acknowledgePrintEvent(eventId: string) {
  await printEvents.acknowledge(eventId)
}
</script>

<template>
  <section class="mx-auto max-w-6xl py-10">
    <div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div class="gp-card p-8">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-primary/80">
              Session
            </p>
            <h1 class="mt-2 text-5xl font-black">
              Dining in progress
            </h1>
          </div>
          <AppButton variant="ghost" @click="loadSessionData">
            Refresh
          </AppButton>
        </div>
        <p class="mt-4 text-white/60">
          Phase: {{ session.phase }}
        </p>
        <p class="mt-1 text-xs text-white/45">
          Realtime: {{ realtime.connectionState }}
        </p>

        <div class="mt-8 rounded-2xl border border-white/15 p-5">
          <p class="text-sm text-white/60">
            Active Order
          </p>
          <p v-if="activeOrder.loading" class="mt-3 text-sm text-white/45">
            Loading active order...
          </p>
          <p v-else-if="activeOrder.error" class="mt-3 text-sm text-red-300">
            {{ activeOrder.error }}
          </p>
          <p v-else-if="!activeOrder.data" class="mt-3 text-sm text-white/45">
            No active order found.
          </p>
          <template v-else>
            <p class="mt-3 text-white/80">
              Order #{{ activeOrder.data.id }} · {{ activeOrder.data.status }}
            </p>
            <ul class="mt-3 space-y-2 text-sm text-white/65">
              <li v-for="item in activeOrder.data.items" :key="item.id">
                {{ item.name }} × {{ item.quantity }}
              </li>
            </ul>
          </template>
        </div>
      </div>

      <aside class="gp-card p-6">
        <p class="text-sm text-white/60">
          Print Events
        </p>
        <p v-if="printEvents.loading" class="mt-3 text-sm text-white/45">
          Loading print events...
        </p>
        <p v-else-if="printEvents.error" class="mt-3 text-sm text-red-300">
          {{ printEvents.error }}
        </p>
        <p v-else-if="printEvents.events.length === 0" class="mt-3 text-sm text-white/45">
          No pending print events.
        </p>
        <ul v-else class="mt-4 space-y-3">
          <li v-for="event in printEvents.events" :key="event.id" class="rounded-xl border border-white/15 p-3">
            <p class="text-sm text-white/80">
              {{ event.status }}
            </p>
            <p class="mt-1 text-xs text-white/45">
              Event #{{ event.id }}
            </p>
            <AppButton
              v-if="!event.acknowledgedAt"
              class="mt-3"
              size="sm"
              @click="acknowledgePrintEvent(event.id)"
            >
              Acknowledge
            </AppButton>
            <p v-else class="mt-2 text-xs text-green-300">
              Acknowledged
            </p>
          </li>
        </ul>
      </aside>
    </div>
    <AppButton class="mt-8" variant="ghost" size="lg" @click="endSession">
      End Session
    </AppButton>
  </section>
</template>
