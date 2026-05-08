<script setup lang="ts">
import { submitRefillOrder } from '~/services/api/orders'
import { canSubmitRefillOrder } from '~/utils/submission'

definePageMeta({ middleware: ['session-phase'] })
const cart = useCartStore()
const menu = useMenuStore()
const session = useSessionStore()
const order = useOrderStore()
const items = computed(() => menu.visibleItems)

const errorMessage = ref<string | null>(null)

onMounted(async () => {
  order.clearOrderError()
  const sessionId = session.sessionId
  if (!sessionId) {
    await navigateTo('/start')
    return
  }

  if (menu.refillMenu.length > 0)
    return
  try {
    await menu.loadRefillMenu(sessionId)
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load refill menu.'
  }
})

async function submitRefill() {
  if (order.submitting)
    return

  const sessionId = session.sessionId
  const initialOrderId = session.initialOrderId

  if (!sessionId || !initialOrderId || cart.refillCount <= 0) {
    order.setError('Session is not ready for refill submission.')
    return
  }

  order.startSubmitting()
  try {
    await submitRefillOrder({
      sessionId,
      initialOrderId,
      items: cart.refillCart.map(item => ({
        id: item.id,
        quantity: item.quantity,
      })),
    })

    cart.clearRefillCart()
    await navigateTo('/session')
  }
  catch (error) {
    order.setError(error instanceof Error ? error.message : 'Refill submission failed.')
  }
  finally {
    order.finishSubmitting()
  }
}
</script>

<template>
  <section class="mx-auto max-w-7xl py-8">
    <div class="gp-card border-primary/30 p-6">
      <p class="text-sm uppercase tracking-[.25em] text-primary">
        Refill Mode
      </p>
      <h1 class="mt-2 text-4xl font-black">
        Sides and modifiers only
      </h1>
      <p class="mt-2 text-white/55">
        Full menu and package changes are locked after initial order.
      </p>
    </div>
    <p v-if="errorMessage || order.lastError" class="mt-4 text-sm text-red-300">
      {{ errorMessage || order.lastError }}
    </p>
    <div class="mt-8 grid grid-cols-3 gap-5">
      <article v-for="item in items" :key="item.id" class="gp-card p-6">
        <h2 class="text-2xl font-bold">
          {{ item.name }}
        </h2>
        <p class="mt-2 text-sm text-white/45">
          {{ item.refillGroup }}
        </p>
        <AppButton class="mt-6 w-full" @click="cart.add(item)">
          Add Refill
        </AppButton>
      </article>
    </div>
    <p v-if="!menu.loading && items.length === 0" class="mt-6 text-sm text-white/60">
      Only refill-eligible items are available in this phase.
    </p>
    <AppButton class="mt-8" size="lg" :disabled="!canSubmitRefillOrder(order.submitting, session.sessionId, session.initialOrderId, cart.refillCount)" @click="submitRefill">
      {{ order.submitting ? 'Submitting...' : 'Submit Refill' }}
    </AppButton>
  </section>
</template>
