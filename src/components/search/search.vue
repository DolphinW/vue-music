<template>
  <div class="search">
    <div class="search-box-wrapper log">
      <search-box @updateQuery="_updateQuery" ref="searchBox"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="hot-key">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li @click="hotSearch(item)" class="item" v-for="(item,index) in hotKeys" :key="index">
            <span>{{item.k}}</span>
          </li>
        </ul>
      </div>
      <div class="search-history">
        <h1 class="title">
          <span class="text">搜索历史</span>
          <span class="clear">
      <i class="icon-clear"></i>
      </span>
        </h1>
        <!--<search-list></search-list>-->
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>

  </div>
</template>

<script>
/*eslint-disable*/
  import SearchBox from '../../base/search-box/search-box'
  import {getHotKey} from '../../api/search'
  import {ERR_OK} from '../../api/config'
  import Suggest from '../suggest/suggest'

  export default {
    name: 'search',
    data() {
      return {
        hotKeys: [],
        query: ''
      }
    },
    created() {
      this.initHotKey()
    },
    components: {
      SearchBox,
      Suggest
    },
    methods: {
      _updateQuery(newQuery) {
        this.query = newQuery
      },
      initHotKey() {
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKeys = res.data.hotkey
          }
        })
      },
      hotSearch(item){
        this.query=item.k
        this.$refs.searchBox.setQuery(item.k)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
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
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
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
</style>
