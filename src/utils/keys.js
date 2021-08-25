export const isDarwin = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform)

export const CODES = {
  C: 'KeyC',
  V: 'KeyV',
}

export const KEYS = {
  CTRL_OR_CMD: isDarwin ? 'metaKey' : 'ctrlKey',
}
