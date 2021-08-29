<script setup>
  import { defineProps, defineEmits } from 'vue'

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

  const emit = defineEmits(['delete-block', 'arrow-up', 'arrow-down'])

  function keydown(event) {
    const ARROW_UP = 38
    const ARROW_DOWN = 40
    const BACKSPACE = 8
    let key = ''

    if (event.keyCode === ARROW_UP) {
      emit('arrow-up')
    } else if (event.keyCode === ARROW_DOWN) {
      emit('arrow-down')
    } else if (event.keyCode === BACKSPACE) {
      emit('delete-block')
    }
  }
</script>

<template>
  <input
    :id="id"
    :src="props.content"
    :alt="props.text"
    type="image"
    class="focus:outline-none focus:ring-2 focus:ring-blue-600"
    @keydown="keydown"
  />
</template>
