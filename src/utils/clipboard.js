/*
  local clipboard.

  advantages (in contrast to the 'real' clipboard)
  - no special browser permission necessary on getting the clipboard content
  - synchronous function
*/

let clipboardValue = null

export function clipboardSetBlock(block) {
  const copyBlock = { ...block, id: undefined }
  const blockJson = JSON.stringify(copyBlock)
  clipboardValue = blockJson
}

export function clipboardClear() {
  clipboardValue = null
}

export function clipboardGetBlock() {
  try {
    const text = clipboardGetText()
    if (text) {
      const block = JSON.parse(text)
      return block
    }
    return null
  } catch (err) {
    return null
  }
}

export function clipboardGetText() {
  return clipboardValue
}
