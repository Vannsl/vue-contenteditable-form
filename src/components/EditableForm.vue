<script setup>
  import { useBlocks } from '../composables/useBlocks.js'
  import EditableBlock from './EditableBlock.vue'

  const { blocks, updateBlock, addBlockAfter } = useBlocks()

  function addAndFocusOnBlock(index) {
    addBlockAfter(index)
    // TODO: focuss
  }
</script>

<template>
  <EditableBlock
    v-for="(block, index) in blocks"
    ref="blockElements"
    :key="block.id"
    :tag="block.tag"
    :html="block.html"
    @changeContent="(html) => updateBlock(block.id, html)"
    @enterPressed="addAndFocusOnBlock(index)"
  />
</template>
