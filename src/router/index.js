import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 实现异步加载
const Rank = (resolve) => {
  import('../components/rank/rank').then((module) => {
    resolve(module)
  })
}

const Recommend = (resolve) => {
  import('../components/recommend/recommend').then((module) => {
    resolve(module)
  })
}

const Singer = (resolve) => {
  import('../components/singer/singer').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('../components/search/search').then((module) => {
    resolve(module)
  })
}

const SingerDetail = (resolve) => {
  import('../components/singer-detail/singerdetail').then((module) => {
    resolve(module)
  })
}

const RecommendDetail = (resolve) => {
  import('../components/recommend-detail/recommend-detail').then((module) => {
    resolve(module)
  })
}

const RankSongs = (resolve) => {
  import('../components/rank-songs/rank-songs').then((module) => {
    resolve(module)
  })
}

const UserCenter = (resolve) => {
  import('../components/user-center/user-center').then((module) => {
    resolve(module)
  })
}

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
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
