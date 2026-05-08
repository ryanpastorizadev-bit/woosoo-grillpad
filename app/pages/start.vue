<script setup lang="ts">
import { registerDevice } from '~/services/api/device'
import { restoreSession, startSession } from '~/services/api/session'

definePageMeta({ middleware: ['session-phase'] })
const config = useRuntimeConfig()
const device = useDeviceStore()
const session = useSessionStore()
const posContext = usePosContextStore()
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

  // Load POS context — fall back to mock when backend is unavailable or returns no data.
  await posContext.refresh()
  if (posContext.readiness === null) {
    posContext.enableMock()
  }

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
  <section class="mx-auto grid min-h-[calc(100dvh-3rem)] max-w-6xl place-items-center px-4 py-8">
    <div class="w-full max-w-3xl space-y-6">
      <!-- Registration card -->
      <div class="gp-card p-10 text-center">
        <p class="mb-4 text-sm uppercase tracking-[.35em] text-primary/80">
          Woosoo
        </p>
        <h1 class="text-7xl font-black tracking-tight">
          GrillPad
        </h1>
        <p class="mx-auto mt-5 max-w-xl text-lg text-white/65">
          Register this tablet with the code from the admin device screen, then start the dining session assigned by the backend.
        </p>

        <p v-if="loading" class="mt-8 text-sm text-white/60">
          Loading session state...
        </p>

        <form v-else class="mt-8 space-y-4 text-left" @submit.prevent="submitRegistration">
          <div v-if="needsSessionVerification" class="rounded-lg border border-amber-300/40 bg-amber-300/10 p-3 text-sm text-amber-100">
            Existing cached session was not trusted because backend verification failed.
            <AppButton class="mt-2" variant="ghost" type="button" @click="bootstrapSession">
              Retry verification
            </AppButton>
          </div>

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

          <p v-if="errorMessage" class="text-sm text-red-300">
            {{ errorMessage }}
          </p>
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
      </div>

      <!-- Mini POS readiness section -->
      <div v-if="!loading" class="space-y-4">
        <h2 class="text-sm font-semibold uppercase tracking-widest text-white/40">
          Mini POS Status
          <span v-if="posContext.useMock" class="ml-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-300">
            MOCK
          </span>
        </h2>

        <!-- Readiness banner -->
        <PosReadinessBanner
          :state="posContext.posReadinessState"
          :loading="posContext.loading"
        />

        <!-- Terminal/session card -->
        <TerminalStatusCard
          v-if="posContext.readiness"
          :readiness="posContext.readiness"
        />

        <!-- Table status grid -->
        <div v-if="posContext.tables.length > 0" class="gp-card p-5">
          <div class="mb-4 flex items-center justify-between">
            <p class="text-xs font-semibold uppercase tracking-widest text-white/40">
              Table Status
            </p>
            <button
              class="text-xs text-white/40 hover:text-white/70"
              type="button"
              @click="posContext.refresh()"
            >
              Refresh
            </button>
          </div>
          <TableStatusGrid
            :tables="posContext.tables"
            :assigned-table-id="device.tableId"
          />
        </div>
      </div>
    </div>
  </section>
</template>
