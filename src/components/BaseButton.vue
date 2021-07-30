<template>
  <button
    :class="dynamicClasses"
    class="
      text-indigo-100
      transition-colors
      duration-150
      bg-indigo-700
      rounded-lg
      focus:shadow-outline
      hover:bg-indigo-800
      font-bold
    "
    @click="emit('clicked')"
  >
    <slot />
  </button>
</template>

<script setup>
  import { computed, defineProps, defineEmit } from 'vue'

  const props = defineProps({
    size: {
      type: String,
      default: 'sm',
    },
  })
  const emit = defineEmit(['clicked'])

  const sizeClasses = {
    sm: 'h-8 px-4 text-sm',
    md: 'h-10 px-5',
  }

  const dynamicClasses = computed(() => sizeClasses[props.size])
</script>
