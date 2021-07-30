<script setup>
  import { useBlocks } from '../composables/useBlocks.js'
  import BaseButton from './BaseButton.vue'
  import BaseSpacer from './BaseSpacer.vue'
  import EditableBlock from './EditableBlock.vue'

  const { blocks, updateBlock, addBlock } = useBlocks()
</script>

<template>
  <EditableBlock
    v-for="block in blocks"
    :key="block.id"
    :tag="block.tag"
    :html="block.html"
    @changeContent="(html) => updateBlock(block.id, html)"
  />
  <BaseSpacer />
  <BaseButton @clicked="addBlock">Add Block</BaseButton>
</template>
