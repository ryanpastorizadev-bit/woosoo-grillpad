<script setup lang="ts">
import { restoreSession, startSession } from '~/services/api/session'

definePageMeta({ middleware: ['session-phase'] })
const config = useRuntimeConfig()
const device = useDeviceStore()
const session = useSessionStore()
const { routeForPhase } = useSessionGuard()

const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref<string | null>(null)
const needsSessionVerification = ref(false)
const registration = reactive({
  token: '',
  deviceId: '',
  tableId: '',
  tableName: ''
})

async function bootstrapSession() {
  loading.value = true
  needsSessionVerification.value = false
  errorMessage.value = null

  device.restoreFromStorage()
  session.restoreFromStorage()

  if (device.isRegistered) {
    try {
      const snapshot = await restoreSession()
      session.hydrate({
        sessionId: snapshot.sessionId,
        tableId: snapshot.tableId,
        phase: snapshot.phase,
        packageId: snapshot.packageId,
        initialOrderId: snapshot.initialOrderId,
        initialOrderSubmittedAt: snapshot.initialOrderSubmittedAt
      })

      if (!['unregistered', 'ended'].includes(session.phase)) {
        await navigateTo(routeForPhase(session.phase))
        return
      }
    }
    catch (error) {
      // Backend is source of truth: never continue from a cached active session after restore failure.
      session.reset()
      needsSessionVerification.value = true
      errorMessage.value = error instanceof Error
        ? `Unable to verify active session: ${error.message}`
        : 'Unable to verify active session. Please retry or register again.'
    }
  }

  if (!device.isRegistered) {
    session.reset()
  }

  loading.value = false
}

onMounted(async () => {
  await bootstrapSession()
})

async function submitRegistration() {
  if (submitting.value) return
  errorMessage.value = null
  needsSessionVerification.value = false
  if (!registration.token || !registration.deviceId || !registration.tableId || !registration.tableName) {
    errorMessage.value = 'All registration fields are required.'
    return
  }

  submitting.value = true
  try {
    device.setDevice({
      token: registration.token,
      deviceId: registration.deviceId,
      tableId: registration.tableId,
      tableName: registration.tableName
    })

    const started = await startSession({ tableId: registration.tableId })
    session.start(started.tableId, started.sessionId)
    await navigateTo(routeForPhase(session.phase))
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to start dining session.'
    device.clearDevice()
    session.reset()
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="mx-auto grid min-h-[calc(100dvh-3rem)] max-w-6xl place-items-center">
    <div class="gp-card max-w-3xl p-10 text-center">
      <p class="mb-4 text-sm uppercase tracking-[.35em] text-primary/80">Woosoo</p>
      <h1 class="text-7xl font-black tracking-tight">GrillPad</h1>
      <p class="mx-auto mt-5 max-w-xl text-lg text-white/65">Session-based tablet ordering for initial packages and controlled refills.</p>

      <p v-if="loading" class="mt-8 text-sm text-white/60">Loading session state...</p>

      <form v-else class="mt-8 space-y-4 text-left" @submit.prevent="submitRegistration">
        <div v-if="needsSessionVerification" class="rounded-lg border border-amber-300/40 bg-amber-300/10 p-3 text-sm text-amber-100">
          Existing cached session was not trusted because backend verification failed.
          <AppButton class="mt-2" variant="ghost" type="button" @click="bootstrapSession">Retry verification</AppButton>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <label class="text-sm text-white/70">
            Device Token
            <input v-model="registration.token" type="text" class="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-white" autocomplete="off">
          </label>
          <label class="text-sm text-white/70">
            Device ID
            <input v-model="registration.deviceId" type="text" class="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-white" autocomplete="off">
          </label>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <label class="text-sm text-white/70">
            Table ID
            <input v-model="registration.tableId" type="text" class="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-white" autocomplete="off">
          </label>
          <label class="text-sm text-white/70">
            Table Name
            <input v-model="registration.tableName" type="text" class="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-white" autocomplete="off">
          </label>
        </div>
        <p v-if="errorMessage" class="text-sm text-red-300">{{ errorMessage }}</p>
        <AppButton type="submit" size="lg" class="w-full" :disabled="submitting">{{ submitting ? 'Starting...' : 'Start Dining' }}</AppButton>
      </form>

      <div class="mt-4 text-center">
        <p class="text-xs text-white/40">Session routes are phase-guarded and backend-validated.</p>
      </div>
      <p class="mt-10 text-xs text-white/35">v{{ config.public.appVersion }}</p>
    </div>
  </section>
</template>
