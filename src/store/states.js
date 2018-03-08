import {playMode} from '../common/js/config'
import {loadSearchHistory, loadPlayHistory} from '../common/js/cache'

// state的初始值可以是普通数值，也可是从localStorage中获取到的。
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  diss: {},
  rank: {},
  searchHistory: loadSearchHistory(),
  playHistory: loadPlayHistory()
}

export default state
