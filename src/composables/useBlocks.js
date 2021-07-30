import { v4 } from 'uuid'
import { readonly, ref } from 'vue'
import {
  localStorageSave,
  localStorageHas,
  localStorageGet,
} from '../utils/localStorage'

const BLOCKS = 'blocks'

const initialBlock = { id: v4(), html: 'Hello', tag: 'p' }

const blocks = ref([])

if (localStorageHas(BLOCKS)) {
  blocks.value = localStorageGet(BLOCKS)
} else {
  blocks.value = [initialBlock]
}

export function useBlocks() {
  function updateBlock(id, html) {
    const block = blocks.value.find((block) => block.id === id)
    block.html = html
  }

  function addBlock() {
    blocks.value.push(initialBlock)
  }

  function saveBlocks() {
    localStorageSave(BLOCKS, blocks.value)
  }

  return {
    blocks: readonly(blocks),
    addBlock,
    updateBlock,
    saveBlocks,
  }
}
