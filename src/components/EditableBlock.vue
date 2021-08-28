<script>
  import clickOutside from '../directives/clickOutside'
  import ChangeType from './ChangeType.vue'

  export default {
    directives: {
      clickOutside,
    },
  }
</script>

<script setup>
  import {
    defineProps,
    nextTick,
    defineEmits,
    ref,
    toRef,
    watch,
    computed,
  } from 'vue'
  import contenteditable from 'vue-contenteditable'
  import TextToolbar from './TextToolbar.vue'
  import { useBlocks } from '../composables/useBlocks.js'

  const { updateTag } = useBlocks()

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
    isLastBlock: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits([
    'change-content',
    'enter-pressed',
    'delete-block',
    'arrow-up',
    'arrow-down',
  ])

  const html = toRef(props, 'html')
  const content = ref('')

  const toolbar = ref(null)
  const isHighlighted = ref(false)
  const selection = ref(null)
  const wasMouseUpEvent = ref(false)

  function keyDown(event) {
    const ARROW_UP = 38
    const ARROW_DOWN = 40
    const BACKSPACE = 8

    if (event.keyCode === ARROW_UP) {
      event.preventDefault()
      emit('arrow-up')
    } else if (
      event.keyCode === ARROW_DOWN &&
      !(props.isLastBlock && content.value.trim() === '')
    ) {
      event.preventDefault()
      emit('arrow-down')
    } else if (event.keyCode === BACKSPACE) {
      const sel = window.getSelection()
      if (sel && sel.anchorOffset === 0 && sel.focusOffset === 0) {
        event.preventDefault()
        emit('delete-block')
      }
    }
  }

  function mouseUp() {
    if (!props.hasToolbar) return
    isHighlighted.value = false

    selection.value = document.getSelection()
    if (!selection.value.toString().trim().length) return

    wasMouseUpEvent.value = true
    const rect = selection.value.getRangeAt(0).getBoundingClientRect()
    isHighlighted.value = true
    toolbar.value.style.left = `${rect.x}px`
    toolbar.value.style.top = `${rect.y - 44}px`
  }

  function closeToolbar() {
    if (wasMouseUpEvent.value) return

    wasMouseUpEvent.value = false
    isHighlighted.value = false
  }

  watch(
    () => content.value,
    () => {
      emit('change-content', content.value)
    }
  )
  watch(
    html,
    (x) => {
      content.value = x
    },
    { immediate: true }
  )

  const showChangeType = computed(
    () => props.tag !== 'h1' && content.value === '/'
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

  function changeBlockTag(tag) {
    const id = props.id
    content.value = ''
    updateTag(id, tag)
    nextTick(() => {
      const el = document.getElementById(id)
      if (el) {
        el.focus()
      }
    })
  }
</script>

<template>
  <div>
    <div
      v-show="isHighlighted"
      ref="toolbar"
      v-click-outside="closeToolbar"
      class="absolute"
    >
      <TextToolbar
        @clicked-bold="surroundWith('strong')"
        @clicked-italic="surroundWith('em')"
      />
    </div>
    <ChangeType
      v-if="showChangeType"
      @clicked-title="changeBlockTag('h2')"
      @clicked-paragraph="changeBlockTag('p')"
    />
    <contenteditable
      :id="id"
      v-model="content"
      :tag="tag"
      :no-n-l="true"
      :no-h-t-m-l="true"
      :placeholder="placeholder"
      class="px-2 py-1 focus:outline-none focus:bg-gray-100"
      @keydown="keyDown"
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

  :deep(h2) {
    @apply font-bold text-lg;
  }
</style>
