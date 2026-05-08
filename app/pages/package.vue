<script setup lang="ts">
definePageMeta({ middleware: ['session-phase'] })
const session = useSessionStore()
const menu = useMenuStore()
const submitting = ref(false)
const errorMessage = ref<string | null>(null)

onMounted(async () => {
  if (menu.packages.length > 0)
    return
  try {
    await menu.loadPackages()
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load packages.'
  }
})

async function choose(packageId: string) {
  submitting.value = true
  errorMessage.value = null
  try {
    await menu.loadInitialMenu(packageId)
    session.setPackage(packageId)
    await navigateTo('/order/initial')
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load initial menu.'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <AppScreen width="lg" class="py-10">
    <AppSectionHeader title="Choose Package" />
    <ErrorState v-if="errorMessage" class="mt-4" :message="errorMessage" />
    <div class="mt-8 grid grid-cols-2 gap-6">
      <MenuItemCard
        v-for="pkg in menu.packages"
        :key="pkg.id"
        :title="pkg.name"
        :subtitle="pkg.description"
        :price="pkg.price"
      >
        <AppButton class="w-full" size="lg" :disabled="submitting" @click="choose(pkg.id)">
          Select
        </AppButton>
      </MenuItemCard>
    </div>
    <EmptyState
      v-if="!menu.loading && menu.packages.length === 0"
      class="mt-6"
      title="No packages available"
      description="No packages available for this session."
    />
  </AppScreen>
</template>
