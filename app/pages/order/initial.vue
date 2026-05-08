<script setup lang="ts">
import type { MenuItem } from '~/types/order'

definePageMeta({ middleware: ['session-phase'] })
const cart = useCartStore()
const session = useSessionStore()
const menu = useMenuStore()
const errorMessage = ref<string | null>(null)

const items = computed(() => menu.visibleItems)
const quantityById = computed(() => new Map(cart.initialCart.map(item => [item.id, item.quantity])))

onMounted(async () => {
  if (!session.packageId) {
    await navigateTo('/package')
    return
  }

  if (menu.initialMenu.length > 0)
    return
  try {
    await menu.loadInitialMenu(session.packageId)
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load menu.'
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

async function goToReview() {
  await navigateTo('/order/review')
}
</script>

<template>
  <AppScreen>
    <AppSectionHeader kicker="Initial Order" title="Build the first round" />

    <ErrorState v-if="errorMessage" class="mt-4" :message="errorMessage" />

    <LoadingState
      v-else-if="menu.loading && items.length === 0"
      class="mt-8"
      title="Loading menu"
      description="Preparing initial-order options."
    />

    <EmptyState
      v-else-if="items.length === 0"
      class="mt-8"
      title="No items available"
      description="No initial-order items are available for this package."
    />

    <div v-else class="mt-8 grid grid-cols-3 gap-5">
      <MenuItemCard
        v-for="item in items"
        :key="item.id"
        :title="item.name"
        :subtitle="item.categoryId"
      >
        <QuantityStepper
          :value="quantityFor(item.id)"
          @increment="increment(item)"
          @decrement="decrement(item.id)"
        />
      </MenuItemCard>
    </div>

    <BottomActionBar>
      <AppButton size="lg" :disabled="cart.initialCount === 0" @click="goToReview">
        Review Order
      </AppButton>
    </BottomActionBar>
  </AppScreen>
</template>
