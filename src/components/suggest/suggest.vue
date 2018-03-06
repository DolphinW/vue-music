<template>
  <scroll ref="suggest"
          class="suggest"
          :data="suggestList"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in suggestList" :key="index">
        <div class="icon">
          <i :class="setitemIcon(item)"></i>
        </div>
        <div class="name">
          <p class="text">{{getItemName(item)}}</p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !suggestList.length">
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
  import Singer from '../../common/js/singer'
  import {mapMutations,mapActions} from 'vuex'

  const perpage = 20
  const TYPE_SINGER = 1

  export default {
    name: "suggest",
    data() {
      return {
        suggestList: [],
        page: 1,
        hasMore: false,
        pullup: true,
        beforeScroll: true
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
    computed: {},
    methods: {
      selectItem(item){
        if(item.type && item.type===TYPE_SINGER){
          let singer=new Singer(item.singermid, item.singername)
          this.setSinger(singer)
          this.$router.push({
            path:`/search/${singer.id}`
          })
          return
        }
        console.log(item);
        this.insertSong(item)
      },
      _search() {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this.suggestList = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      _genResult(data) {
        let ret = []
        if(this.page===1){
          if (data.zhida && data.zhida.singerid) {
            ret.push({...data.zhida, ...{type: TYPE_SINGER}})
          }
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSong(data.song.list))
        }
        return ret
      },
      _normalizeSong(list) {
        let ret = []
        list.forEach(musicData => {
          ret.push(createSong(musicData))
        })
        return ret
      },
      setitemIcon(item) {
        return item.type && item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
      },
      getItemName(item) {
        return item.singerid ? item.singername : item.name
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.suggestList = this.suggestList.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      listScroll(){
        // 优化用户体验，因为手机端input获取请求时，会自动打开手机键盘
        // 此事件用于 当监听到滚动开始时，让input失去焦点，收起手机的键盘。
        this.$emit('listScroll')
      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() {
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
