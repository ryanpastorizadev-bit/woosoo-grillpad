<script setup lang="ts">
withDefaults(defineProps<{
  kicker?: string
  title?: string
  subtitle?: string
}>(), {
  kicker: undefined,
  title: undefined,
  subtitle: undefined,
})
</script>

<template>
  <header>
    <p v-if="kicker" class="text-primary/80">
      {{ kicker }}
    </p>
    <h1 v-if="title" class="mt-2 text-5xl font-black">
      {{ title }}
    </h1>
    <p v-if="subtitle" class="mt-2 text-white/60">
      {{ subtitle }}
    </p>
    <div v-if="$slots.default" class="mt-2">
      <slot />
    </div>
  </header>
</template>
