<template>
  <div class="singer">
    <list-view @select="onSelectSinger" :data="singers"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
/* eslint-disable */
  import ListView from '../../base/listview/listview'
  import {getSingerList} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  import Singer from '../../common/js/singer'
  import {mapMutations} from 'vuex'


  const HOT_NAME = "热门"
  const HOT_LIST_LEN = 10

  export default {
    name: 'singer',
    components: {
      ListView
    },
    data() {
      return {
        singers: []
      }
    },
    created() {
      this.initSingerList()
    },
    methods: {
      initSingerList() {
        getSingerList().then(res => {
          if (res.code == ERR_OK) {
            this.singers = this.normalizeData(res.data.list)
          }
        })
      },
      normalizeData(list) {
        let map={
          hot:{
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_LIST_LEN) {
            map.hot.items.push(new Singer(
              item.Fsinger_mid,
              item.Fsinger_name
            ))
          }
          let key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer(
            item.Fsinger_mid,
            item.Fsinger_name
          ))
        })
        // 处理排序
        let hot=[]
        let ret=[]
        for(let key in map){
          let val=map[key]
          if(val.title.match(/[a-zA-Z]/)){
            ret.push(val)
          }else if(val.title==HOT_NAME){
            hot.push(val)
          }
        }
        ret.sort((a,b)=>{
          return a.title.charCodeAt(0)-b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      onSelectSinger(singer){
        this.$router.push( {
          path:`/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      // 由于mapMutations中均是设置state的方法，所以在methods中
      // 这里起的别名，右侧是与mutation-types中等号右侧的值相等的。
      ...mapMutations({
        setSinger:'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
