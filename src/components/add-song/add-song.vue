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
        <search-box @updateQuery="_updateQuery" ref="searchBox" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="switch-wrapper" v-show="!query">
        <switches :data="ary"></switches>
      </div>
      <div class="shortcut">
        <div class="list-wrapper">
          <div class="list-scroll">
            <div class="list-inner">

            </div>
          </div>
          <div class="list-scroll">
            <div class="list-inner">

            </div>
          </div>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" ref="suggest"></suggest>
      </div>

    </div>
  </transition>
</template>

<script>
/*eslint-disable*/
import SearchBox from '../../base/search-box/search-box'
import Scroll from '../../base/scroll/scroll'
import Suggest from '../../components/suggest/suggest'
import Switches from '../../base/switches/switches'

  export default {
    name: "add-song",
    data(){
      return {
        showFlag:false,
        query:'',
        ary:[
          "添加歌曲",
          "个人收藏"
        ]
      }
    },
    methods:{
      show(){
        this.showFlag=true
      },
      hide(){
        this.showFlag=false
      },
      _updateQuery(newQuery){
        this.query=newQuery
      }
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
      Switches
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
</style>
