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
const registrationToken = ref('')

const normalizedRegistrationToken = computed(() => registrationToken.value.replace(/\D/g, '').slice(0, 6))
const canSubmitRegistration = computed(() => normalizedRegistrationToken.value.length === 6 && !submitting.value)

watch(registrationToken, (value) => {
  const normalized = value.replace(/\D/g, '').slice(0, 6)
  if (value !== normalized)
    registrationToken.value = normalized
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

  if (!device.isRegistered)
    session.reset()

  loading.value = false
}

onMounted(async () => {
  await bootstrapSession()
})

async function submitRegistration() {
  if (!canSubmitRegistration.value)
    return

  errorMessage.value = null
  needsSessionVerification.value = false
  submitting.value = true

  try {
    const registered = await registerDevice({ token: normalizedRegistrationToken.value })
    device.setFromRegistration(registered)

    const started = await startSession({ tableId: registered.table.id })
    session.start(started.tableId, started.sessionId)
    await navigateTo(routeForPhase(session.phase))
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to register this tablet. Please ask staff for a new code.'
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
      <p class="mb-4 text-sm uppercase tracking-[.35em] text-primary/80">
        Woosoo
      </p>
      <h1 class="text-7xl font-black tracking-tight">
        GrillPad
      </h1>
      <p class="mx-auto mt-5 max-w-xl text-lg text-white/65">
        Session-based tablet ordering for initial packages and controlled refills.
      </p>

      <p v-if="loading" class="mt-8 text-sm text-white/60">
        Loading session state...
      </p>

      <form v-else class="mt-8 space-y-5 text-left" @submit.prevent="submitRegistration">
        <div v-if="needsSessionVerification" class="rounded-lg border border-amber-300/40 bg-amber-300/10 p-3 text-sm text-amber-100">
          Existing cached session was not trusted because backend verification failed.
          <AppButton class="mt-2" variant="ghost" type="button" @click="bootstrapSession">
            Retry verification
          </AppButton>
        </div>

        <div class="rounded-2xl border border-white/10 bg-black/20 p-5">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[.28em] text-primary/70">
                Tablet Registration
              </p>
              <h2 class="mt-2 text-2xl font-bold text-white">
                Enter your 6-digit table code
              </h2>
              <p class="mt-2 text-sm text-white/55">
                Ask staff for the code shown on the admin screen. QR scanning will be added in the next hardware pass.
              </p>
            </div>
            <div class="rounded-xl border border-dashed border-primary/40 px-4 py-3 text-center text-xs uppercase tracking-[.18em] text-primary/75">
              QR Scanner<br>
              Placeholder
            </div>
          </div>

          <label class="mt-6 block text-sm text-white/70">
            Registration Code
            <input
              v-model="registrationToken"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="6"
              type="text"
              class="mt-2 w-full rounded-xl border border-white/20 bg-black/40 px-5 py-4 text-center text-4xl font-black tracking-[.45em] text-white outline-none transition focus:border-primary/70"
              autocomplete="one-time-code"
              placeholder="000000"
            >
          </label>
        </div>

        <p v-if="errorMessage" class="rounded-lg border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
          {{ errorMessage }}
        </p>

        <AppButton type="submit" size="lg" class="w-full" :disabled="!canSubmitRegistration">
          {{ submitting ? 'Registering Tablet...' : 'Register Tablet & Start Dining' }}
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
  </section>
</template>
