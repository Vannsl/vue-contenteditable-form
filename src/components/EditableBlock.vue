<script setup>
  import { defineProps, defineEmit, ref, watch } from 'vue'
  import contenteditable from 'vue-contenteditable'
  import TextToolbar from './TextToolbar.vue'

  const props = defineProps({
    tag: {
      type: String,
      default: '',
    },
    html: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    hasToolbar: {
      type: Boolean,
      default: true,
    },
  })

  const emit = defineEmit(['change-content', 'enter-pressed'])

  const content = ref(props.html)

  const toolbar = ref(null)
  const isEditable = ref(true)
  const isHighlighted = ref(false)
  const selection = ref(null)

  function mouseUp() {
    if (!props.hasToolbar) return

    selection.value = document.getSelection()
    isHighlighted.value = false
    if (!selection.value.toString().trim().length) return

    const rect = selection.value.getRangeAt(0).getBoundingClientRect()
    isHighlighted.value = true
    toolbar.value.style.left = `${rect.x}px`
    toolbar.value.style.top = `${rect.y - 44}px`
  }

  function closeToolbar() {
    isHighlighted.value = false
  }

  watch(
    () => content.value,
    () => {
      emit('change-content', content.value)
    }
  )

  function surroundWith(element) {
    const strong = document.createElement(element)
    const range = selection.value.getRangeAt(0).cloneRange()
    range.surroundContents(strong)
    selection.value.removeAllRanges()
    selection.value.addRange(range)
  }

  function enterPressed() {
    emit('enter-pressed')
  }
</script>

<template>
  <div>
    <div v-show="isHighlighted" ref="toolbar" class="absolute">
      <TextToolbar
        @clicked-bold="surroundWith('strong')"
        @clicked-italic="surroundWith('em')"
        @clicked-close="closeToolbar"
      />
    </div>
    <contenteditable
      :id="id"
      v-model="content"
      :tag="tag"
      :contenteditable="isEditable"
      :no-n-l="true"
      :no-h-t-m-l="true"
      :placeholder="placeholder"
      class="px-2 py-1 focus:outline-none focus:bg-gray-100"
      @mouseup="mouseUp"
      @returned="enterPressed"
    />
  </div>
</template>

<style scoped>
  [placeholder]:empty::before {
    @apply text-gray-400;
    content: attr(placeholder);
  }

  [placeholder]:empty:focus::before {
    content: '';
  }

  :deep(h1) {
    @apply font-bold text-2xl;
  }
</style>
