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
  <AppScreen>
    <AppSectionHeader kicker="Review" title="Confirm your initial order" />
    <ErrorState v-if="order.lastError" class="mt-4" :message="order.lastError" />
    <div class="mt-8">
      <CartSummaryPanel :count="cart.initialCount" :items="cart.initialCart" />
    </div>
    <BottomActionBar>
      <p class="text-sm text-white/70">
        Items: {{ cart.initialCount }}
      </p>
      <AppButton size="lg" :disabled="!canSubmitInitialOrder(order.submitting, session.sessionId, session.packageId, cart.initialCount)" @click="submitInitial">
        {{ order.submitting ? 'Submitting...' : 'Submit Initial Order' }}
      </AppButton>
    </BottomActionBar>
  </AppScreen>
</template>
