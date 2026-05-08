<script setup lang="ts">
import { submitInitialOrder } from '~/services/api/orders'
import { canSubmitInitialOrder } from '~/utils/submission'

definePageMeta({ middleware: ['session-phase'] })

const cart = useCartStore()
const session = useSessionStore()
const menu = useMenuStore()
const order = useOrderStore()

onMounted(() => {
  order.clearOrderError()
})

async function submitInitial() {
  if (order.submitting)
    return

  const sessionId = session.sessionId
  const packageId = session.packageId

  if (!sessionId || !packageId || cart.initialCount <= 0) {
    order.setError('Session is not ready for submission.')
    return
  }

  order.startSubmitting()
  try {
    const response = await submitInitialOrder({
      sessionId,
      packageId,
      items: cart.initialCart.map(item => ({
        id: item.id,
        quantity: item.quantity,
      })),
    })

    session.markInitialOrderSubmitted(response.orderId)
    cart.clearInitialCart()
    await menu.loadRefillMenu(sessionId)
    await navigateTo('/order/refill')
  }
  catch (error) {
    order.setError(error instanceof Error ? error.message : 'Initial order submission failed.')
  }
  finally {
    order.finishSubmitting()
  }
}
</script>

<template>
  <section class="mx-auto max-w-7xl py-8">
    <div class="flex items-end justify-between gap-6">
      <div>
        <p class="text-primary/80">
          Review
        </p>
        <h1 class="text-5xl font-black">
          Confirm your initial order
        </h1>
      </div>
      <AppButton size="lg" :disabled="!canSubmitInitialOrder(order.submitting, session.sessionId, session.packageId, cart.initialCount)" @click="submitInitial">
        {{ order.submitting ? 'Submitting...' : 'Submit Initial Order' }}
      </AppButton>
    </div>
    <p v-if="order.lastError" class="mt-4 text-sm text-red-300">
      {{ order.lastError }}
    </p>

    <div class="mt-8 gp-card p-6">
      <p class="text-sm text-white/60">
        Items: {{ cart.initialCount }}
      </p>
      <ul class="mt-4 space-y-2 text-sm text-white/70">
        <li v-for="item in cart.initialCart" :key="item.id">
          {{ item.name }} x{{ item.quantity }}
        </li>
      </ul>
    </div>
  </section>
</template>
