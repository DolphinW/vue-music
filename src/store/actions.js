import * as types from '../store/mutation-types'
import {shuffle} from '../common/js/utils'
import {playMode} from '../common/js/config'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 同一个动作的mutations封装到一起
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
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  // 当前歌曲
  let currentSong = playList[currentIndex]
  // 查找是否已存在改歌曲
  let fpIndex = findIndex(playList, currentSong)
  // 插入歌曲
  playList.splice(currentIndex, 0, song)
  currentIndex++
  // 验证是否已添加过
  if (fpIndex > -1) {
    if (fpIndex < currentIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }

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
