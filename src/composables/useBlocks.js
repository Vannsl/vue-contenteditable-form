import { v4 } from 'uuid'
import { readonly, ref } from 'vue'
import {
  localStorageSave,
  localStorageHas,
  localStorageGet,
} from '../utils/localStorage'

const BLOCKS = 'blocks'
const TITLE = 'title'

const createInitialBlock = () => ({ id: v4(), html: '', tag: 'p' })
const title = ref('')

const blocks = ref([])

if (localStorageHas(BLOCKS)) {
  blocks.value = localStorageGet(BLOCKS)
} else {
  blocks.value = [createInitialBlock()]
}

if (localStorageHas(TITLE)) {
  title.value = localStorageGet(TITLE)
}

export function useBlocks() {
  function updateBlock(id, html) {
    const block = blocks.value.find((block) => block.id === id)
    block.html = html
  }

  function updateTitle(html) {
    title.value = html
  }

  function addBlockAfter(index) {
    const newBlock = createInitialBlock()
    blocks.value.splice(index + 1, 0, newBlock)
    return newBlock
  }

  function saveTitle() {
    localStorageSave(TITLE, title.value)
  }

  function saveBlocks() {
    localStorageSave(BLOCKS, blocks.value)
  }

  function save() {
    saveBlocks()
    saveTitle()
  }

  function resetBlocks() {
    blocks.value = [createInitialBlock()]
    saveBlocks()
  }

  function resetTitle() {
    title.value = ''
    saveTitle()
  }

  function reset() {
    resetBlocks()
    resetTitle()
  }

  return {
    blocks,
    title: readonly(title),
    addBlockAfter,
    updateTitle,
    updateBlock,
    save,
    reset,
  }
}
