<script setup lang="ts">
withDefaults(defineProps<{
  class?: string
}>(), {
  class: '',
})
</script>

<template>
  <div :class="`fixed inset-x-6 bottom-24 z-30 rounded-2xl border border-white/10 bg-black/70 p-3 shadow-2xl backdrop-blur ${$props.class}`">
    <div class="flex items-center justify-between gap-3">
      <slot />
    </div>
  </div>
</template>
