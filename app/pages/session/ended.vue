<script setup lang="ts">
definePageMeta({ middleware: ['session-phase'] })
const session = useSessionStore()

function returnToStart() {
  session.reset()
  navigateTo('/start')
}
</script>

<template>
  <section class="grid min-h-[calc(100dvh-3rem)] place-items-center text-center">
    <div class="gp-card p-10">
      <p class="text-primary">
        Session Ended
      </p>
      <h1 class="mt-3 text-5xl font-black">
        Thank you.
      </h1>
      <GpButton class="mt-8" size="lg" @click="returnToStart">
        Return to Start
      </GpButton>
    </div>
  </section>
</template>
