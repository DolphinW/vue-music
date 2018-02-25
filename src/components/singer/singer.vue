<template>
  <div class="singer">
    <list-view :data="singers"></list-view>
  </div>
</template>

<script>
/* eslint-disable */
  import ListView from '../../base/listview/listview'
  import {getSingerList} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  import Singer from '../../common/js/singer'

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
        console.log(map);
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
      }
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
