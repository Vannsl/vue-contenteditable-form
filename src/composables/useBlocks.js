import { v4 } from 'uuid'
import { readonly, ref } from 'vue'
import {
  localStorageSave,
  localStorageHas,
  localStorageGet,
} from '../utils/localStorage'

const BLOCKS = 'blocks'

const createInitialBlock = () => ({ id: v4(), html: '', tag: 'p' })

const blocks = ref([])

if (localStorageHas(BLOCKS)) {
  blocks.value = localStorageGet(BLOCKS)
} else {
  blocks.value = [createInitialBlock()]
}

export function useBlocks() {
  function updateBlock(id, html) {
    const block = blocks.value.find((block) => block.id === id)
    block.html = html
  }

  function addBlockAfter(index) {
    blocks.value.splice(index + 1, 0, createInitialBlock())
  }

  function saveBlocks() {
    localStorageSave(BLOCKS, blocks.value)
  }

  function resetBlocks() {
    blocks.value = [createInitialBlock()]
    saveBlocks()
  }

  return {
    blocks: readonly(blocks),
    addBlockAfter,
    updateBlock,
    saveBlocks,
    resetBlocks,
  }
}
