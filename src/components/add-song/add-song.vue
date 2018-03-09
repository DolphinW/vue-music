<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box  :showSinger="showSinger" @updateQuery="_updateQuery" ref="searchBox" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="switch-wrapper" v-show="!query">
        <switches @toggle="toggleSwitch" :data="switches" :currentSwitch="currentSwitch"></switches>
      </div>
      <div class="shortcut" v-show="!query">
        <div class="list-wrapper">
          <Scroll :refreshDelay="refreshDelay" ref="songList" class="list-scroll" :data="searchHistory" v-if="currentSwitch===0">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </Scroll>
          <Scroll :refreshDelay="refreshDelay" ref="searchList" class="list-scroll" :data="searchHistory" v-if="currentSwitch===1">
            <div class="list-inner">
              <search-list @select="onSelectSearchHistory"
                           @delete="onDeleteSearchHistory"
                           :data="searchHistory"></search-list>
            </div>
          </Scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest @listScroll="onBlurIpt" @select="selectSuggest" :query="query" ref="suggest"></suggest>
      </div>
      <top-tip ref="tip">
        <div class="tips">
          <div class="icon">
            <i class="icon-ok"></i>
          </div>
          <div class="text">已成功添加歌曲到列表！</div>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
/*eslint-disable*/
import SearchBox from '../../base/search-box/search-box'
import Scroll from '../../base/scroll/scroll'
import Suggest from '../../components/suggest/suggest'
import Switches from '../../base/switches/switches'
import {searchMixin} from '../../common/js/mixin'
import SearchList from '../../base/search-list/search-list'
import SongList from '../../base/song-list/song-list'
import {mapGetters,mapActions} from 'vuex'
import Song from '../../common/js/song'
import TopTip from '../../base/top-tip/top-tip'

  export default {
    mixins:[searchMixin],
    name: "add-song",
    data(){
      return {
        showFlag:false,
        showSinger:false,
        currentSwitch:0,
        switches:[
          {name:"最近播放"},
          {name:"搜索历史"}
        ]
      }
    },
    computed:{
      ...mapGetters([
        'playHistory'
      ])
    },
    methods:{
      show(){
        this.showFlag=true
        setTimeout(()=>{
          if(this.currentSwitch===0){
            this.$refs.songList.refresh()
          }else{
            this.$refs.searchList.refresh()
          }
        },20)
      },
      hide(){
        this.showFlag=false
      },
      toggleSwitch(index){
        this.currentSwitch=index
      },
      selectSuggest(){
        this.onSelectResultItem()
        this.showTip()
      },
      selectSong(song,index){
        if(index!=0){
          this.insertSong(new Song(song))
        }
        this.showTip()
      },
      showTip(){
        this.$refs.tip.show()
      },
      ...mapActions([
        'insertSong'
      ])
    },
    watch:{
      query(){
        setTimeout(()=>{
          this.$refs.suggest.refresh()
        },20)
      }
    },
    components:{
      SearchBox,
      Scroll,
      Suggest,
      Switches,
      SearchList,
      SongList,
      TopTip
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position:fixed
    top:0
    bottom:0
    width: 100%
    z-index:200
    background:$color-background
    &.slide-enter-active,&.slide-leave-active
      transition:all .3s
    &.slide-enter,&.slide-leave-to
      transform:translate3d(100%,0,0)
    .header
      position:relative
      height:44px
      text-align:center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position:absolute
        top:0
        right:8px
        .icon-close
          display: block
          padding:12px
          font-size:20px
          color: $color-theme
    .switch-wrapper
      width: 240px
      margin: 0 auto
    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position:absolute
        top:165px;
        bottom:0
        width: 100%
        .list-scroll
          height: 100%
          overflow:hidden
          .list-inner
            padding:20px 30px
    .search-result
      position:fixed
      top:124px
      bottom:0
      width: 100%
    .tip-title
      text-align:center
      padding:18px 0
      font-size:0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
  .tips
    display: flex
    justify-content center
</style>
