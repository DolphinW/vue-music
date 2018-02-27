import * as types from '../store/mutation-types'

// 同一个动作的mutations封装到一起
export const setPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN_STATE, true)
}
