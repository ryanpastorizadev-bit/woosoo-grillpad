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
  <section class="mx-auto max-w-6xl py-10">
    <h1 class="text-5xl font-black">
      Choose Package
    </h1>
    <p v-if="errorMessage" class="mt-4 text-sm text-red-300">
      {{ errorMessage }}
    </p>
    <div class="mt-8 grid grid-cols-2 gap-6">
      <article v-for="pkg in menu.packages" :key="pkg.id" class="gp-card p-8">
        <h2 class="text-3xl font-bold">
          {{ pkg.name }}
        </h2>
        <p class="mt-3 text-white/60">
          {{ pkg.description }}
        </p>
        <p class="mt-6 text-4xl font-black text-primary">
          ₱{{ pkg.price }}
        </p>
        <AppButton class="mt-8 w-full" size="lg" :disabled="submitting" @click="choose(pkg.id)">
          Select
        </AppButton>
      </article>
    </div>
    <p v-if="!menu.loading && menu.packages.length === 0" class="mt-6 text-sm text-white/60">
      No packages available for this session.
    </p>
  </section>
</template>
