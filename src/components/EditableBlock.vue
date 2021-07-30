<script setup>
  import { defineProps, defineEmit, ref, watch } from 'vue'
  import contenteditable from 'vue-contenteditable'

  const props = defineProps({
    tag: {
      type: String,
      default: '',
    },
    html: {
      type: String,
      default: '',
    },
  })
  const emit = defineEmit(['change-content', 'enter-pressed'])

  const content = ref(props.html)

  const isEditable = ref(true)

  watch(
    () => content.value,
    () => {
      emit('change-content', content.value)
    }
  )

  function enterPressed() {
    emit('enter-pressed')
  }
</script>

<template>
  <contenteditable
    v-model="content"
    :tag="tag"
    :contenteditable="isEditable"
    :no-n-l="true"
    :no-h-t-m-l="true"
    placeholder="Type to add a block"
    @returned="enterPressed"
  />
</template>

<style scoped>
  [placeholder]:empty::before {
    @apply text-gray-400;
    content: attr(placeholder);
  }

  [placeholder]:empty:focus::before {
    content: '';
  }
</style>
