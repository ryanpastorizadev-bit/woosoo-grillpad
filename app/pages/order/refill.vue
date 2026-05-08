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
  <AppScreen>
    <AppSectionHeader
      kicker="Refill Mode"
      title="Sides and modifiers only"
      description="Full menu and package changes are locked after initial order."
    />
    <ErrorState
      v-if="errorMessage || order.lastError"
      class="mt-4"
      :message="errorMessage || order.lastError"
    />
    <div class="mt-8 grid grid-cols-3 gap-5">
      <MenuItemCard
        v-for="item in items"
        :key="item.id"
        :title="item.name"
        :subtitle="item.refillGroup"
        badge="Refill"
      >
        <AppButton class="w-full" @click="cart.add(item)">
          Add Refill
        </AppButton>
      </MenuItemCard>
    </div>
    <EmptyState
      v-if="!menu.loading && items.length === 0"
      class="mt-6"
      title="No items available"
      description="Only refill-eligible items are available in this phase."
    />
    <BottomActionBar>
      <p class="text-sm text-white/70">
        Refill cart: {{ cart.refillCount }}
      </p>
      <AppButton size="lg" :disabled="!canSubmitRefillOrder(order.submitting, session.sessionId, session.initialOrderId, cart.refillCount)" @click="submitRefill">
        {{ order.submitting ? 'Submitting...' : 'Submit Refill' }}
      </AppButton>
    </BottomActionBar>
  </AppScreen>
</template>
