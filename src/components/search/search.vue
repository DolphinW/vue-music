<template>
  <div class="search">
    <div class="search-box-wrapper log">
      <search-box @updateQuery="_updateQuery" ref="searchBox"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shotCutWrapper">
      <scroll :refreshDelay="refreshDelay" :data="shotCut" class="shortcut" ref="shotcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="hotSearch(item.k)" class="item" v-for="(item,index) in hotKeys" :key="index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="clearSearchHistory">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @select="onSelectSearchHistory"
                         @delete="onDeleteSearchHistory"
                         :data="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest @select="onSelectResultItem" @listScroll="onBlurIpt" :query="query" ref="suggest"></suggest>
    </div>
    <confirm ref="confirmBox" text="是否全部清除?" confirmBtnText="清除" @onConfirm="confirmClearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
/*eslint-disable*/
  import SearchBox from '../../base/search-box/search-box'
  import {getHotKey} from '../../api/search'
  import {ERR_OK} from '../../api/config'
  import Suggest from '../suggest/suggest'
  import {mapGetters,mapActions} from 'vuex'
  import SearchList from '../../base/search-list/search-list'
  import {playListMixin,searchMixin} from '../../common/js/mixin'
  import Scroll from '../../base/scroll/scroll'
  import Confirm from '../../base/confirm/confirm'

  export default {
    mixins:[playListMixin,searchMixin],
    name: 'search',
    data() {
      return {
        hotKeys: []
      }
    },
    created() {
      this.initHotKey()
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Scroll,
      Confirm
    },
    computed:{
      shotCut(){
        return this.hotKeys.concat(this.searchHistory)
      },
      ...mapGetters([
        'searchHistory'
      ])
    },
    watch:{
      query(newQuery){
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shotcut.refresh()
          }, 20)
        }
      }
    },
    methods: {
      handlePlayList(playList){
        let bottom = playList.length>0 ? '60px':''
        this.$refs.shotCutWrapper.style.bottom=bottom
        this.$refs.shotcut.refresh()

        this.$refs.searchResult.style.bottom=bottom
        this.$refs.suggest.refresh()
      },
      clearSearchHistory(){
        this.$refs.confirmBox.open()
      },
      confirmClearSearchHistory(){
        this.clearSearch()
        this.$refs.confirmBox.close()
      },
      initHotKey() {
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKeys = res.data.hotkey
          }
        })
      },
      hotSearch(item){
        this.query=item
        this.addQuery(item)
      },
      ...mapActions([
        'clearSearch'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
