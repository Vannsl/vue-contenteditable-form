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
  function isBlockEmpty(block) {
    if (block.tag === 'img') {
      return !block.image
    } else {
      return !block.html
    }
  }

  function updateBlock(id, html) {
    const block = blocks.value.find((block) => block.id === id)
    block.html = html
  }

  function updateTag(id, tag) {
    const block = blocks.value.find((block) => block.id === id)
    if (!block) {
      throw Error(`Block ${id} not found`)
    }
    block.tag = tag
  }

  function updateTitle(html) {
    title.value = html
  }

  function addBlockAfter(index, html = '') {
    const newBlock = createInitialBlock()
    newBlock.html = html
    blocks.value.splice(index + 1, 0, newBlock)
    return newBlock
  }

  function addCopyBlockAfter(index, block) {
    const newBlock = { ...block, id: v4() }
    blocks.value.splice(index + 1, 0, newBlock)
    return newBlock
  }

  function exchangeCopyBlock(index, block) {
    const newBlock = { ...block, id: blocks.value[index].id }
    blocks.value[index] = newBlock
    return newBlock
  }
  function addImageBlockAfter(index, content, text) {
    const newBlock = { id: v4(), content: content, text, tag: 'img' }
    blocks.value.splice(index + 1, 0, newBlock)
    return newBlock
  }

  function deleteBlock(id) {
    blocks.value = blocks.value.filter((block) => block.id !== id)
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
    isBlockEmpty,
    deleteBlock,
    addBlockAfter,
    addCopyBlockAfter,
    exchangeCopyBlock,
    addImageBlockAfter,
    updateTag,
    updateTitle,
    updateBlock,
    save,
    reset,
  }
}
