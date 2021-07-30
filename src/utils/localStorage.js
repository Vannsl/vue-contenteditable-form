/**
 * Check if key exists in local storage
 * @param  string key
 * @return boolean
 */
export function localStorageHas(key) {
  var item = localStorage.getItem(key)

  return item !== null
}

/**
 * Retrive an object from local storage.
 * @param  string key
 * @return mixed
 */
export function localStorageGet(key) {
  var item = localStorage.getItem(key)

  if (!item) return

  if (item[0] === '{' || item[0] === '[') return JSON.parse(item)

  return item
}

/**
 * Save some value to local storage.
 * @param string key
 * @param string value
 */
export function localStorageSave(key, value) {
  if (value === undefined) alert("Can't store undefinded value")

  if (typeof value === 'object' || Array.isArray(value)) {
    value = JSON.stringify(value)
  }

  if (typeof value !== 'string') alert("Can't store unrecognized format value")

  localStorage.setItem(key, value)
}

/**
 * Remove element from local storage.
 * @param string key
 */
export function localStorageRemove(key) {
  localStorage.removeItem(key)
}
