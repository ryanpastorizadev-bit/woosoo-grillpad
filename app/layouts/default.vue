<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '~/stores/session'

const session = useSessionStore()
const shellClass = computed(() => (session.isActive ? 'grillpad-shell min-h-dvh p-6 pb-44' : 'grillpad-shell min-h-dvh p-6'))
</script>

<template>
  <main :class="shellClass">
    <slot />
    <ServiceRequestBar v-if="session.isActive" />
    <UpdateAvailableBanner />
  </main>
</template>
