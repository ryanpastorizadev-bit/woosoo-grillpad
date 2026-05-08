<script setup lang="ts">
definePageMeta({ middleware: ['session-phase'] })
const session = useSessionStore()
const update = useUpdateStore()

onMounted(() => {
  if (update.updateAvailable && !update.isApplyingUpdate) {
    update.applyUpdate()
  }
})

function returnToStart() {
  session.reset()
  navigateTo('/start')
}
</script>

<template>
  <AppScreen width="md" class="grid min-h-[calc(100dvh-3rem)] place-items-center py-0 text-center">
    <AppCard class="p-10">
      <AppSectionHeader kicker="Session Ended" title="Thank you." />
      <GpButton class="mt-8" size="lg" @click="returnToStart">
        Return to Start
      </GpButton>
    </AppCard>
  </AppScreen>
</template>
