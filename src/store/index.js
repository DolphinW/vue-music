import Vuex from 'vuex'
import Vue from 'vue'
import state from './states'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
// vuex提供的控制台输出日志的插件
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 非生产环境可开启debug调试器
const debug = (process.env.NODE_ENV !== 'production')

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store
