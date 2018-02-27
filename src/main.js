import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import router from './router'
import VueLazyload from 'vue-lazyload'
import store from './store'

/* eslint-disable */
// Vue.config.productionTip = false

fastclick.attach(document.body)

// 全局声明懒加载，设置默认图。
Vue.use(VueLazyload , {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
