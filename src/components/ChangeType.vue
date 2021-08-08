<template>
  <div
    class="
      popup
      absolute
      flex flex-col
      justify-items-end
      border border-gray-200
      shadow-md
      rounded
      pl-2
      pr-2
      py-1
      bg-white
    "
  >
    <BaseButton
      size="square"
      color="primaryFlat"
      title="Title"
      @clicked="emit('clicked-title')"
    >
      Title
    </BaseButton>
    <BaseButton
      size="square"
      color="primaryFlat"
      title="Paragraph"
      @clicked="emit('clicked-paragraph')"
    >
      Paragraph
    </BaseButton>
  </div>
</template>

<script setup>
  import { defineEmits } from 'vue'
  import BaseButton from './BaseButton.vue'

  const emit = defineEmits(['clicked-title', 'clicked-paragraph'])
</script>

<style scoped>
  .popup {
    margin-left: -16px;
    margin-top: 2.5rem;
  }
</style>
