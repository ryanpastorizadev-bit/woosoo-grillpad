<script setup lang="ts">
definePageMeta({ middleware: ['session-phase'] })

const session = useSessionStore()

function endSession() {
  session.end()
  navigateTo('/session/ended')
}
</script>

<template>
  <AppScreen width="lg" class="py-10">
    <AppCard class="p-8">
      <AppSectionHeader kicker="Session" title="Dining in progress" :subtitle="`Phase: ${session.phase}`" />
      <AppButton class="mt-8" variant="ghost" size="lg" @click="endSession">
        End Session
      </AppButton>
    </AppCard>
  </AppScreen>
</template>
