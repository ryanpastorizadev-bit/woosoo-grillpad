<script setup lang="ts">
interface CartSummaryRow {
  id: string
  label: string
  quantity: number
}

withDefaults(defineProps<{
  title?: string
  subtitle?: string
  items?: CartSummaryRow[]
}>(), {
  title: 'Order summary',
  subtitle: undefined,
  items: () => [],
})
</script>

<template>
  <AppCard class="p-6">
    <p class="text-sm uppercase tracking-[.2em] text-white/55">
      {{ title }}
    </p>
    <p v-if="subtitle" class="mt-2 text-sm text-white/70">
      {{ subtitle }}
    </p>

    <ul v-if="items.length > 0" class="mt-4 space-y-2 text-sm text-white/80">
      <li v-for="item in items" :key="item.id" class="flex items-center justify-between gap-4">
        <span>{{ item.label }}</span>
        <span class="font-semibold">x{{ item.quantity }}</span>
      </li>
    </ul>

    <slot v-else />
  </AppCard>
</template>
