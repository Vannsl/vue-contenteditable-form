<script setup>
  import { defineEmit } from 'vue'
  import BaseButton from './BaseButton.vue'

  const emit = defineEmit(['clicked-bold', 'clicked-italic'])
</script>

<template>
  <div
    class="
      font-mono font-bold
      flex
      border border-gray-200
      shadow-md
      rounded
      pl-2
      py-1
      bg-white
    "
  >
    <BaseButton
      size="square"
      color="primaryFlat"
      title="Bold"
      @clicked="emit('clicked-bold')"
    >
      B
    </BaseButton>
    <BaseButton
      size="square"
      color="primaryFlat"
      title="Italic"
      @clicked="emit('clicked-italic')"
    >
      I
    </BaseButton>
  </div>
</template>
