<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  kicker?: string
  title?: string
  subtitle?: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
}>(), {
  level: 1,
})

const headingTag = computed(() => `h${props.level}`)
const headingClass = computed(() => ({
  1: 'text-5xl',
  2: 'text-4xl',
  3: 'text-3xl',
  4: 'text-2xl',
  5: 'text-xl',
  6: 'text-lg',
})[props.level])
</script>

<template>
  <header>
    <p v-if="kicker" class="text-primary/80">
      {{ kicker }}
    </p>
    <component :is="headingTag" v-if="title" class="mt-2 font-black" :class="headingClass">
      {{ title }}
    </component>
    <p v-if="subtitle" class="mt-2 text-white/60">
      {{ subtitle }}
    </p>
    <div v-if="$slots.default" class="mt-2">
      <slot />
    </div>
  </header>
</template>
