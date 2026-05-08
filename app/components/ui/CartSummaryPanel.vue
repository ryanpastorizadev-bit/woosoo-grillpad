<script setup lang="ts">
import type { CartItem } from '~/types/order'

withDefaults(defineProps<{
  title?: string
  items: CartItem[]
  count: number
  emptyLabel?: string
}>(), {
  title: 'Order Summary',
  emptyLabel: 'No items added yet.',
})
</script>

<template>
  <AppCard padding="md">
    <p class="text-sm text-white/60">
      {{ title }} • {{ count }} item{{ count === 1 ? '' : 's' }}
    </p>
    <ul v-if="items.length > 0" class="mt-4 space-y-2 text-sm text-white/75">
      <li v-for="item in items" :key="item.id">
        {{ item.name }} x{{ item.quantity }}
      </li>
    </ul>
    <p v-else class="mt-4 text-sm text-white/60">
      {{ emptyLabel }}
    </p>
  </AppCard>
</template>
