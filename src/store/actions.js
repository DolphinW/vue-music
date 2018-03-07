import * as types from '../store/mutation-types'
import {shuffle} from '../common/js/utils'
import {playMode} from '../common/js/config'
import {saveSearchHistory, deleteSearchHistory, clearSearchHistory} from '../common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 同一个动作的mutations封装到一起
// 对多个mutaitions的封装

export const setPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN_STATE, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const setMusicRandom = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_PLAY_LIST, shuffle(list))
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
  let currentIndex = state.currentIndex
  // 只能在mutations中修改state数据
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  // 当前歌曲
  let currentSong = playList[currentIndex]
  // 查找是否已存在改歌曲
  let fpIndex = findIndex(playList, currentSong)
  // 在这个索引之前添加，故先增长再添加
  currentIndex++
  // 插入歌曲
  playList.splice(currentIndex, 0, song)
  // 验证是否已添加过
  if (fpIndex > -1) {
    // 只要有添加过，就删掉之前添加的
    if (fpIndex < currentIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      // 因为在其前面我们增加了currentIndex的song，所以这里索引多1
      playList.splice(fpIndex + 1, 1)
    }
  }

  // 获取当前歌曲要在sequencelist插入的位置，splice 在第一个参数之前添加。
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN_STATE, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const setSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearchHistory(query))
}

export const deleteSearch = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearchHistory(query))
}

export const clearSearch = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearchHistory())
}
