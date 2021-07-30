<script setup>
  import { useBlocks } from '../composables/useBlocks.js'
  import EditableBlock from './EditableBlock.vue'

  const { blocks, updateBlock, addBlockAfter } = useBlocks()
</script>

<template>
  <EditableBlock
    v-for="(block, index) in blocks"
    :key="block.id"
    :tag="block.tag"
    :html="block.html"
    @changeContent="(html) => updateBlock(block.id, html)"
    @enterPressed="addBlockAfter(index)"
  />
</template>
