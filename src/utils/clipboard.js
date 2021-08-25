export async function addBlockToClipboard(block) {
  const copyBlock = { ...block, id: undefined }
  const blockJson = JSON.stringify(copyBlock)
  await navigator.clipboard.writeText(blockJson)
}

export async function getClipboardText() {
  try {
    const text = await navigator.clipboard.readText()
    return text
  } catch (err) {
    return null
  }
}
