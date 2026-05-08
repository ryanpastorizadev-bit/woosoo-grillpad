<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle?: string
  price?: number | null
  badge?: string
}>(), {
  subtitle: '',
  price: null,
  badge: '',
})
</script>

<template>
  <AppCard padding="md">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="mt-2 text-sm text-white/45">
          {{ subtitle }}
        </p>
      </div>
      <AppBadge v-if="badge">
        {{ badge }}
      </AppBadge>
    </div>

    <p v-if="price !== null" class="mt-4 text-3xl font-black text-primary">
      ₱{{ price }}
    </p>

    <div class="mt-6">
      <slot />
    </div>
  </AppCard>
</template>
