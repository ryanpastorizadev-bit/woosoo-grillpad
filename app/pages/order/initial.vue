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

  if (menu.initialMenu.length > 0) return
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
  <section class="mx-auto max-w-7xl py-8">
    <div class="flex items-end justify-between gap-6">
      <div>
        <p class="text-primary/80">Initial Order</p>
        <h1 class="text-5xl font-black">Build the first round</h1>
      </div>
      <AppButton size="lg" :disabled="cart.initialCount === 0" @click="goToReview">Review Order</AppButton>
    </div>
    <p v-if="errorMessage" class="mt-4 text-sm text-red-300">{{ errorMessage }}</p>
    <div class="mt-8 grid grid-cols-3 gap-5">
      <article v-for="item in items" :key="item.id" class="gp-card p-6">
        <h2 class="text-2xl font-bold">{{ item.name }}</h2>
        <p class="mt-2 text-sm text-white/45">{{ item.categoryId }}</p>
        <AppButton class="mt-6 w-full" @click="cart.add(item)">Add</AppButton>
      </article>
    </div>
    <p v-if="!menu.loading && items.length === 0" class="mt-6 text-sm text-white/60">No initial-order items available.</p>
  </section>
</template>
