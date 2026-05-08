<script setup lang="ts">
definePageMeta({ middleware: ['session-phase'] })

const session = useSessionStore()

function endSession() {
  session.end()
  navigateTo('/session/ended')
}
</script>

<template>
  <section class="mx-auto max-w-6xl py-10">
    <div class="gp-card p-8">
      <p class="text-primary/80">
        Session
      </p>
      <h1 class="mt-2 text-5xl font-black">
        Dining in progress
      </h1>
      <p class="mt-4 text-white/60">
        Phase: {{ session.phase }}
      </p>
      <AppButton class="mt-8" variant="ghost" size="lg" @click="endSession">
        End Session
      </AppButton>
    </div>
  </section>
</template>
