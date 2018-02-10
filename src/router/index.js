import Vue from 'vue'
import Router from 'vue-router'
import Rank from '../components/rank/rank'
import Recomment from '../components/recommend/recommend'
import Singer from '../components/singer/singer'
import Search from '../components/search/search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/recommend',
      component: Recomment
    },
    {
      path: '/singer',
      component: Singer
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
