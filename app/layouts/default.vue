<script setup lang="ts">
const session = useSessionStore()
const showServiceRequestBar = computed(() => session.isOrderingPhase)
const shellClass = computed(() => (showServiceRequestBar.value ? 'grillpad-shell min-h-dvh p-6 pb-44' : 'grillpad-shell min-h-dvh p-6'))
</script>

<template>
  <main :class="shellClass">
    <slot />
    <ServiceRequestBar v-if="showServiceRequestBar" />
    <UpdateAvailableBanner />
  </main>
</template>
