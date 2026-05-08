<script setup lang="ts">
withDefaults(defineProps<{
  kicker?: string
  title?: string
  description?: string
}>(), {
  kicker: undefined,
  title: undefined,
  description: undefined,
})
</script>

<template>
  <header class="flex items-end justify-between gap-6">
    <div>
      <p v-if="kicker" class="text-primary/80">
        {{ kicker }}
      </p>
      <h1 v-if="title" class="text-5xl font-black">
        {{ title }}
      </h1>
      <p v-if="description" class="mt-2 text-white/60">
        {{ description }}
      </p>
      <div v-if="$slots.default" class="mt-2">
        <slot />
      </div>
    </div>
    <slot name="actions" />
  </header>
</template>
