import {playMode} from '../common/js/config'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.normal,
  currentIndex: -1
}

export default state
