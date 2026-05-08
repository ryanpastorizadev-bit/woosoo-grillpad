<script setup lang="ts">
withDefaults(defineProps<{
  kicker?: string
}>(), { kicker: undefined })
</script>

<template>
  <header>
    <p v-if="kicker" class="text-primary/80">{{ kicker }}</p>
    <div class="mt-2">
      <slot />
    </div>
  </header>
</template>
