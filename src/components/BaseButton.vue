<template>
  <button
    :class="dynamicClasses"
    class="transition-colors duration-150 rounded-md focus:shadow-outline"
    @click="emit('clicked')"
  >
    <slot />
  </button>
</template>

<script setup>
  import { computed, defineProps, defineEmit } from 'vue'

  const props = defineProps({
    color: {
      type: String,
      default: 'primary',
      validator(val) {
        return ['primary', 'primaryUnfilled', 'primaryFlat'].includes(val)
      },
    },
    size: {
      type: String,
      default: 'sm',
      validator(val) {
        return ['square', 'sm', 'md'].includes(val)
      },
    },
  })
  const emit = defineEmit(['clicked'])

  const sizeClasses = {
    square: 'text-sm py-1 px-2',
    sm: 'text-sm py-2.5 px-5',
    md: 'text-md py-3 px-6',
  }

  const colorClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    primaryUnfilled: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    primaryFlat: 'text-blue-600  hover:bg-blue-100',
  }

  const dynamicClasses = computed(
    () => `${sizeClasses[props.size]} ${colorClasses[props.color]}`
  )
</script>
