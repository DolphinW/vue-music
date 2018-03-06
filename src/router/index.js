import Vue from 'vue'
import Router from 'vue-router'
import Rank from '../components/rank/rank'
import Recommend from '../components/recommend/recommend'
import Singer from '../components/singer/singer'
import Search from '../components/search/search'
import SingerDetail from '../components/singer-detail/singerdetail'
import RecommendDetail from '../components/recommend-detail/recommend-detail'
import RankSongs from '../components/rank-songs/rank-songs'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankSongs
        }
      ]
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: RecommendDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
