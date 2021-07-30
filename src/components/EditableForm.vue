<script setup>
  import { ref } from 'vue'
  import Draggable from 'vuedraggable'
  import EditableBlock from './EditableBlock.vue'
  import { useBlocks } from '../composables/useBlocks.js'

  const drag = ref(false)

  const dragOptions = {
    animation: 200,
    disabled: false,
    ghostClass: 'ghost',
  }

  const { blocks, updateBlock, addBlockAfter } = useBlocks()

  function addAndFocusOnBlock(index) {
    addBlockAfter(index)
    // TODO: focuss
  }
</script>

<template>
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
        class="flex flex-grow items-center w-full"
        role="button"
        tabindex="0"
      >
        <div data-action="handle" class="p-1 cursor-move text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="{2}"
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </div>
        <EditableBlock
          :tag="element.tag"
          :html="element.html"
          class="w-full"
          @changeContent="(html) => updateBlock(element.id, html)"
          @enterPressed="addAndFocusOnBlock(index)"
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
