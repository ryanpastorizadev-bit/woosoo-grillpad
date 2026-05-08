<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  price?: number | null
  badge?: string
  class?: string
}>(), {
  price: null,
})

const rootClass = computed(() => cn('gp-card p-6', props.class))
</script>

<template>
  <article :class="rootClass">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="mt-2 text-sm text-white/55">
          {{ subtitle }}
        </p>
      </div>
      <AppBadge v-if="badge" variant="accent">
        {{ badge }}
      </AppBadge>
    </div>

    <p v-if="price !== null" class="mt-4 text-xl font-black text-primary">
      ₱{{ price }}
    </p>

    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </article>
</template>
