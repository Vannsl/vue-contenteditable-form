export function isSelectionEmpty() {
  const sel = document.getSelection()
  return sel && sel.toString().length === 0
}
