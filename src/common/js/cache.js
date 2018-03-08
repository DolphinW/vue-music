/*eslint-disable*/
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 100

export function insertAry(arr, val, compare, maxLen) {
  let oldIndex = arr.findIndex(compare)
  let ret = arr.slice()
  if (oldIndex == 0) {
    return ret
  } else if (oldIndex > 0) {
    ret.splice(oldIndex, 1)
    ret.unshift(val)
  } else {
    ret.unshift(val)
    if (maxLen && ret.length > maxLen) {
      ret.pop()
    }
  }
  return ret
}

export function saveSearchHistory(value) {
  let historyAry = loadSearchHistory()
  historyAry = insertAry(historyAry, value, item => item == value, SEARCH_MAX_LEN)
  localStorage.setItem(SEARCH_KEY, JSON.stringify(historyAry))
  return historyAry
}

export function loadSearchHistory() {
  return localStorage.getItem(SEARCH_KEY) ? JSON.parse(localStorage.getItem(SEARCH_KEY)) : []
}

export function deleteFromAry(arr, compare) {
  let oldIndex = arr.findIndex(compare)
  let ret = arr.slice()
  if (oldIndex > -1) {
    ret.splice(oldIndex, 1)
  }
  return ret
}

export function deleteSearchHistory(value) {
  let historyAry = loadSearchHistory()
  historyAry = deleteFromAry(historyAry, item => item == value)
  localStorage.setItem(SEARCH_KEY, JSON.stringify(historyAry))
  return historyAry
}

export function clearSearchHistory() {
  localStorage.getItem(SEARCH_KEY) ? localStorage.removeItem(SEARCH_KEY) : ''
  return []
}

export function loadPlayHistory() {
  return localStorage.getItem(PLAY_KEY) ? JSON.parse(localStorage.getItem(PLAY_KEY)) : []
}

export function savePlayHistory(song) {
  let historyAry = loadPlayHistory()
  historyAry = insertAry(historyAry, song, item => item.id === song.id, PLAY_MAX_LEN)
  localStorage.setItem(PLAY_KEY, JSON.stringify(historyAry))
  return historyAry
}

