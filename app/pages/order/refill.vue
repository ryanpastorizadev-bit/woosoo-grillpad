<script setup lang="ts">
import type { MenuItem } from '~/types/order'
import { submitRefillOrder } from '~/services/api/orders'
import { canSubmitRefillOrder } from '~/utils/submission'

definePageMeta({ middleware: ['session-phase'] })
const cart = useCartStore()
const menu = useMenuStore()
const session = useSessionStore()
const order = useOrderStore()

const items = computed(() => menu.visibleItems)
const quantityById = computed(() => new Map(cart.refillCart.map(item => [item.id, item.quantity])))

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

function quantityFor(itemId: string) {
  return quantityById.value.get(itemId) ?? 0
}

function increment(item: MenuItem) {
  cart.add(item)
}

function decrement(itemId: string) {
  cart.remove(itemId)
}

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
    <AppCard class="border-primary/30 p-6">
      <AppSectionHeader
        kicker="Refill Mode"
        title="Sides and modifiers only"
        subtitle="Full menu and package changes are locked after initial order."
      />
    </AppCard>

    <ErrorState
      v-if="errorMessage || order.lastError"
      class="mt-4"
      :message="errorMessage || order.lastError"
    />

    <LoadingState
      v-else-if="menu.loading && items.length === 0"
      class="mt-8"
      title="Loading refill items"
      description="Fetching refill-eligible menu options."
    />

    <EmptyState
      v-else-if="items.length === 0"
      class="mt-8"
      title="No refill items"
      description="Only refill-eligible items are available in this phase."
    />

    <div v-else class="mt-8 grid grid-cols-3 gap-5">
      <MenuItemCard
        v-for="item in items"
        :key="item.id"
        :title="item.name"
        :subtitle="item.refillGroup"
        badge="Refill"
      >
        <QuantityStepper
          :value="quantityFor(item.id)"
          @increment="increment(item)"
          @decrement="decrement(item.id)"
        />
      </MenuItemCard>
    </div>

    <BottomActionBar>
      <AppButton class="w-full sm:w-auto" size="lg" :disabled="!canSubmitRefillOrder(order.submitting, session.sessionId, session.initialOrderId, cart.refillCount)" @click="submitRefill">
        {{ order.submitting ? 'Submitting...' : 'Submit Refill' }}
      </AppButton>
    </BottomActionBar>
  </AppScreen>
</template>
