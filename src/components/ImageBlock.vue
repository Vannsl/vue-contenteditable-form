<script>
</script>

<script setup>
  import { defineProps } from 'vue'

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
  })
</script>

<template>
  <img :id="id" :src="props.content" :alt="props.text" />
</template>

<style scoped>
</style>
