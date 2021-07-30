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
  const emit = defineEmit(['change-content'])

  const content = ref(props.html)

  const isEditable = ref(true)

  watch(
    () => content.value,
    () => {
      emit('change-content', content.value)
    }
  )
</script>

<template>
  <contenteditable
    v-model="content"
    :tag="tag"
    :contenteditable="isEditable"
    :no-n-l="true"
    :no-h-t-m-l="true"
  />
</template>
