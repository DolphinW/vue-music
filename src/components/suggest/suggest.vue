<template>
  <scroll class="suggest" :data="suggestList">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in suggestList" :key="index">
        <div class="icon">
          <i :class="setitemIcon(item)"></i>
        </div>
        <div class="name">
          <p class="text">{{getItemName(item)}}</p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="showNoResult">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
/*eslint-disable*/
  import NoResult from '../../base/no-result/no-result'
  import Loading from '../../base/loading/loading'
  import Scroll from '../../base/scroll/scroll'
  import {search} from '../../api/search'
  import {ERR_OK} from '../../api/config'
  import {createSong} from '../../common/js/song'

const perpage = 20
const TYPE_SINGER=1

  export default {
    name: "suggest",
    data(){
      return {
        suggestList:[],
        page:1,
        showNoResult:false,
        hasMore:true
      }
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    computed:{

    },
    methods:{
      _search(){
        search(this.query, this.page, this.showSinger, perpage).then(res=>{
          if(res.code===ERR_OK){
            // if(!res.data.song.list.length){
            //   this.hasMore=false
            //   return
            // }
            this.suggestList=this._genResult(res.data)
          }else{
            this.showNoResult=true
          }
        })
      },
      _genResult(data){
        let ret=[]
        if(data.zhida && data.zhida.singerid){
          ret.push({...data.zhida,...{type:TYPE_SINGER}})
        }
        if(data.song){
          ret=ret.concat(this._normalizeSong(data.song.list))
        }
        console.log(ret);
        return ret
      },
      _normalizeSong(list){
        let ret=[]
        list.forEach(musicData=>{
          ret.push(createSong(musicData))
        })
        return ret
      },
      setitemIcon(item){
        return item.type && item.type===TYPE_SINGER ? 'icon-mine':'icon-music'
      },
      getItemName(item){
        return item.singerid?item.singername :item.name
      }
    },
    watch:{
      query(){
        this._search()
      }
    },
    components: {
      NoResult,
      Loading,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
