<script setup>
  import { defineProps, defineEmit, ref, watch } from 'vue'
  import contenteditable from 'vue-contenteditable'
  import BaseButton from './BaseButton.vue'

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
  })

  const emit = defineEmit(['change-content', 'enter-pressed'])

  const content = ref(props.html)

  const toolbar = ref(null)
  const isEditable = ref(true)
  const isHighlighted = ref(false)
  const selection = ref(null)

  function mouseUp() {
    selection.value = document.getSelection()
    isHighlighted.value = false
    if (!selection.value.toString().trim().length) return
    const rect = selection.value.getRangeAt(0).getBoundingClientRect()
    isHighlighted.value = true
    toolbar.value.style.left = `${rect.x - 30}px`
    toolbar.value.style.top = `${rect.y - 40}px`
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
    <div
      v-show="isHighlighted"
      ref="toolbar"
      class="
        absolute
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
        @clicked="surroundWith('strong')"
      >
        Bold
      </BaseButton>
      <BaseButton
        size="square"
        color="primaryFlat"
        @clicked="surroundWith('em')"
      >
        Italic
      </BaseButton>
      <BaseButton size="square" color="primaryFlat" @clicked="closeToolbar">
        &times;
      </BaseButton>
    </div>
    <contenteditable
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
