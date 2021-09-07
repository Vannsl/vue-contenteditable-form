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
  import {
    clipboardGetBlock,
    clipboardClear,
    clipboardSetBlock,
  } from '../utils/clipboard'
  import { selectionIsEmpty } from '../utils/selection'

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

  /*
    split the current line at the caret position and creates a new block below

          hello w|orld   

          hello w
          orld

    on a range-selection (two caret position) split up in left and right part          

          hello w|or|ld

          hello w
          ld
  */
  async function addAndFocusOnBlock(index) {
    const currentBlock = getBlockByIndex(index)
    if (currentBlock) {
      const sel = window.getSelection()
      if (sel) {
        const value = currentBlock.html
        const idxLeft = Math.min(sel.anchorOffset, sel.focusOffset)
        const idxRight = Math.max(sel.anchorOffset, sel.focusOffset)
        const leftValue = value.substring(0, idxLeft).trim()
        const rightValue = value.substring(idxRight).trim()

        updateBlock(currentBlock.id, leftValue)
        const newBlock = addBlockAfter(index, rightValue)

        await focusBlock(newBlock.id)
      }
    }
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

  function copyToClipboard(index) {
    if (selectionIsEmpty()) {
      const block = blocks.value[index]
      if (block) {
        clipboardSetBlock(block)
      }
    } else {
      // no block in clipboard
      clipboardClear()
    }
  }

  /*
  two scenarios
  - in the clipboard there is a block, paste this block as new after the current one
    but do not the default text-paste
  - the normal text-paste, that is done by default behavior.
*/
  function pasteFromToClipboard(index, event) {
    const block = clipboardGetBlock()
    if (block) {
      event.preventDefault()
      const newBlock = addCopyBlockAfter(index, block)
      focusBlock(newBlock.id)
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

  /*
     a, b, c    remove empty b        =>  a,   c
     a, b, c    remove b with content =>  a+b, c
  */
  async function deleteAndFocusPreviousBlock(id, index) {
    const prevBlock = getBlockByIndex(index - 1)
    if (prevBlock) {
      await focusBlock(prevBlock.id)
      const currentBlock = getBlockByIndex(index)
      const currentContent = currentBlock.html
      const prevContent = prevBlock.html
      const prevId = prevBlock.id
      if (currentContent) {
        updateBlock(prevBlock.id, prevContent + currentContent)
      }
      deleteBlock(id)
      focusBlock(prevId, prevContent.length)
    }
  }

  function getBlockByIndex(index) {
    if (index < 0 || index >= blocks.value.length) {
      return null
    }
    return blocks.value[index]
  }

  function setCaret(id, caretIndex) {
    const el = document.getElementById(id)
    const sel = window.getSelection()
    sel.collapse(el.lastChild, caretIndex)
  }

  function focusBlock(id, pos = -1) {
    return nextTick(() => {
      const domElement = document.getElementById(id)
      if (domElement) {
        domElement.focus()
        if (pos >= 0) {
          setCaret(id, pos)
        }
      }
    })
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
          @arrowUp="setFocusOn(index - 1)"
          @arrowDown="setFocusOn(index + 1)"
          @deleteBlock="deleteAndFocusPreviousBlock(element.id, index)"
          @copy="copyToClipboard(index)"
          @paste="(event) => pasteFromToClipboard(index, event)"
        />
        <EditableBlock
          v-else
          :id="element.id"
          :key="element.version"
          :tag="element.tag"
          :html="element.html"
          :is-last-block="index === blocks.length - 1"
          placeholder="Type to add block"
          class="w-full"
          @arrowUp="setFocusOn(index - 1)"
          @arrowDown="setFocusOn(index + 1)"
          @changeContent="(html) => updateBlock(element.id, html)"
          @enterPressed="addAndFocusOnBlock(index)"
          @deleteBlock="deleteAndFocusPreviousBlock(element.id, index)"
          @copy="copyToClipboard(index)"
          @paste="(event) => pasteFromToClipboard(index, event)"
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
