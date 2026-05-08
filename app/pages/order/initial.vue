<script setup lang="ts">
definePageMeta({ middleware: ['session-phase'] })
const cart = useCartStore()
const session = useSessionStore()
const menu = useMenuStore()
const errorMessage = ref<string | null>(null)

const items = computed(() => menu.visibleItems)

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

async function goToReview() {
  await navigateTo('/order/review')
}
</script>

<template>
  <AppScreen>
    <AppSectionHeader kicker="Initial Order" title="Build the first round" />
    <ErrorState v-if="errorMessage" class="mt-4" :message="errorMessage" />
    <div class="mt-8 grid grid-cols-3 gap-5">
      <MenuItemCard
        v-for="item in items"
        :key="item.id"
        :title="item.name"
        :subtitle="item.categoryId"
      >
        <AppButton class="w-full" @click="cart.add(item)">
          Add
        </AppButton>
      </MenuItemCard>
    </div>
    <EmptyState
      v-if="!menu.loading && items.length === 0"
      class="mt-6"
      title="No initial-order items available"
    />
    <BottomActionBar>
      <p class="text-sm text-white/70">
        Items in cart: {{ cart.initialCount }}
      </p>
      <AppButton size="lg" :disabled="cart.initialCount === 0" @click="goToReview">
        Review Order
      </AppButton>
    </BottomActionBar>
  </AppScreen>
</template>
