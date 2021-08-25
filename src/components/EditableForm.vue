<script setup>
  import { nextTick, ref } from 'vue'
  import Draggable from 'vuedraggable'
  import BaseSpacer from './BaseSpacer.vue'
  import IconBin from './IconBin.vue'
  import IconDrag from './IconDrag.vue'
  import IconPlus from './IconPlus.vue'
  import EditableBlock from './EditableBlock.vue'
  import ImageBlock from './ImageBlock.vue'
  import { useBlocks } from '../composables/useBlocks.js'
  import { addBlockToClipboard, getClipboardText } from '../utils/clipboard'

  const drag = ref(false)

  const dragOptions = {
    animation: 200,
    disabled: false,
    ghostClass: 'ghost',
  }

  const {
    title,
    blocks,
    updateBlock,
    updateTitle,
    addBlockAfter,
    addCopyBlockAfter,
    addImageBlockAfter,
    deleteBlock,
  } = useBlocks()

  function addAndFocusOnBlock(index) {
    const newBlock = addBlockAfter(index)
    nextTick(() => {
      const el = document.getElementById(newBlock.id)
      if (el) {
        el.focus()
      }
    })
  }

  function addImageBlock(index) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png, image/jpeg'
    input.onchange = (e) => {
      const file = e.target.files[0]
      const text = file.name
      const reader = new FileReader()
      reader.onload = (readerEvent) => {
        const content = readerEvent.target.result
        addImageBlockAfter(index, content, text)
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  async function copyToClipboard(index) {
    const block = blocks.value[index]
    if (block) {
      addBlockToClipboard(block)
    }
  }

  async function pasteFromToClipboard(index) {
    const text = await getClipboardText()
    if (text) {
      try {
        const block = JSON.parse(text)
        if (block.tag) {
          const newBlock = addCopyBlockAfter(index, block)
          nextTick(() => {
            const el = document.getElementById(newBlock.id)
            if (el) {
              el.focus()
            }
          })
        }
      } catch (err) {
        console.error('want to paste simple text:', text)
      }
    }
  }

  function setFocusOn(index) {
    if (index === -1) return
    if (index === blocks.value.length) {
      addAndFocusOnBlock(index - 1)
      return
    }
    const domElement = document.getElementById(blocks.value[index].id)
    if (domElement) {
      domElement.focus()
    }
  }
</script>

<template>
  <EditableBlock
    tag="h1"
    :html="title"
    :has-toolbar="false"
    class="w-full ml-10 px-2 py-1 focus:outline-none focus:bg-gray-100"
    placeholder="Page Title"
    @changeContent="updateTitle"
  />
  <BaseSpacer />
  <Draggable
    v-model="blocks"
    tag="transition-group"
    :component-data="{
      tag: 'div',
      type: 'transition-group',
      name: !drag ? 'flip-list' : null,
    }"
    handle="[data-action=handle]"
    v-bind="dragOptions"
    item-key="id"
    @start="drag = true"
    @end="drag = false"
  >
    <template #item="{ element, index }">
      <div
        class="flex flex-grow items-center w-full group"
        role="button"
        tabindex="0"
      >
        <div
          class="
            flex
            text-gray-400
            opacity-0
            group-hover:opacity-70
            group-focus:opacity-70
            focus-within:opacity-70
          "
        >
          <button @click="deleteBlock(element.id)">
            <IconBin />
          </button>
          <button @click="addImageBlock(index)">
            <IconPlus />
          </button>
          <div data-action="handle" class="cursor-move">
            <IconDrag />
          </div>
        </div>
        <ImageBlock
          v-if="element.tag === 'img'"
          :id="element.id"
          :content="element.content"
          :text="element.text"
        />
        <EditableBlock
          v-else
          :id="element.id"
          :tag="element.tag"
          :html="element.html"
          placeholder="Type to add block"
          class="w-full"
          @arrowUp="setFocusOn(index - 1)"
          @arrowDown="setFocusOn(index + 1)"
          @changeContent="(html) => updateBlock(element.id, html)"
          @enterPressed="addAndFocusOnBlock(index)"
          @copy="copyToClipboard(index)"
          @paste="pasteFromToClipboard(index)"
        />
      </div>
    </template>
  </Draggable>
</template>

<style scoped>
  .ghost {
    @apply opacity-50;
    @apply bg-gray-200;
  }

  .flip-list-move {
    transition: transform 0.5s;
  }

  .no-move {
    transition: transform 0s;
  }
</style>
