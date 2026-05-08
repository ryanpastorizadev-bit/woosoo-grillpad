<script setup lang="ts">
import { registerDevice } from '~/services/api/device'
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
        initialOrderSubmittedAt: snapshot.initialOrderSubmittedAt,
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
  if (submitting.value)
    return

  const token = registration.token.trim()
  errorMessage.value = null
  needsSessionVerification.value = false

  if (!token) {
    errorMessage.value = 'Registration token is required.'
    return
  }

  submitting.value = true
  try {
    const registered = await registerDevice({ token })

    if (!registered.success) {
      throw new Error('Device registration was rejected by the server.')
    }

    device.setDevice({
      token: registered.token,
      deviceId: registered.device.id,
      tableId: registered.table.id,
      tableName: registered.table.name,
    })

    const started = await startSession({ tableId: registered.table.id })
    session.start(started.tableId, started.sessionId)
    await navigateTo(routeForPhase(session.phase))
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to register this tablet.'
    device.clearDevice()
    session.reset()
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <AppScreen width="lg" class="grid min-h-[calc(100dvh-3rem)] place-items-center py-0">
    <AppCard class="max-w-3xl p-10 text-center">
      <p class="mb-4 text-sm uppercase tracking-[.35em] text-primary/80">
        Woosoo
      </p>
      <h1 class="text-7xl font-black tracking-tight">
        GrillPad
      </h1>
      <p class="mx-auto mt-5 max-w-xl text-lg text-white/65">
        Register this tablet with the code from the admin device screen, then start the dining session assigned by the backend.
      </p>

      <LoadingState
        v-if="loading"
        class="mt-8"
        title="Loading session state"
        description="Checking tablet registration and active dining session."
      />

      <form v-else class="mt-8 space-y-4 text-left" @submit.prevent="submitRegistration">
        <ErrorState
          v-if="needsSessionVerification"
          title="Session verification required"
          message="Existing cached session was not trusted because backend verification failed."
          retryable
          retry-label="Retry verification"
          @retry="bootstrapSession"
        />

        <label class="text-sm text-white/70">
          Registration Token
          <input
            v-model="registration.token"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            class="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-3 text-center text-2xl font-black tracking-[.4em] text-white"
            autocomplete="one-time-code"
            placeholder="000000"
          >
        </label>

        <p class="text-xs text-white/45">
          Device ID, table ID, table name, and API token are accepted only from the backend registration response.
        </p>

        <ErrorState v-if="errorMessage" :message="errorMessage" />

        <AppButton type="submit" size="lg" class="w-full" :disabled="submitting">
          {{ submitting ? 'Registering...' : 'Start Dining' }}
        </AppButton>
      </form>

      <div class="mt-4 text-center">
        <p class="text-xs text-white/40">
          Session routes are phase-guarded and backend-validated.
        </p>
      </div>
      <p class="mt-10 text-xs text-white/35">
        v{{ config.public.appVersion }}
      </p>
    </AppCard>
  </AppScreen>
</template>
