/*eslint-disable*/
const HISTORY_KEY = 'history'
const HISTORY_MAX_LEN = 15

export function insertAry(arr, val, compare, maxLen) {
  let oldIndex = arr.findIndex(compare)
  let ret = arr.slice()
  if (oldIndex == 0) {
    return
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
  historyAry = insertAry(historyAry, value, item => item == value, HISTORY_MAX_LEN)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(historyAry))
  return historyAry
}

export function loadSearchHistory(){
  return localStorage.getItem(HISTORY_KEY) ? JSON.parse(localStorage.getItem(HISTORY_KEY)) : []
}

export function deleteFromAry(arr,compare){
  let oldIndex = arr.findIndex(compare)
  let ret = arr.slice()
  if(oldIndex>-1){
    ret.splice(oldIndex,1)
  }
  return ret
}

export function deleteSearchHistory(value){
  let historyAry=loadSearchHistory()
  historyAry=deleteFromAry(historyAry,item=>item==value)
  localStorage.setItem(HISTORY_KEY,JSON.stringify(historyAry))
  return historyAry
}

export function clearSearchHistory(){
  localStorage.getItem(HISTORY_KEY)?localStorage.removeItem(HISTORY_KEY):''
  return []
}
