<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discLists">
      <div>
        <div class="slider-wrapper" v-if="recommendSliders.length">
          <slider>
            <div v-for="item in recommendSliders" :key="item.id">
              <a :href="item.linkUrl">
                <!--使用fastClick提供的类名，解决阻止BScroll进行click的问题-->
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h2 class="list-title">推荐列表</h2>
          <ul>
            <li class="item" v-for="(item,index) in discLists" :key="index">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discLists.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
/* eslint-disable */
  import {getRecommend, getRecommendList} from '../../api/recommend'
  import {ERR_OK} from '../../api/config'
  import Slider from '../../base/slider/slider'
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'

  export default {
    name: 'recommend',
    data() {
      return {
        recommendSliders: [],
        discLists: [],
        isCheckLoaded: false
      }
    },
    created() {
      this._getRecommend()
      this._getRecommendList()
    },
    methods: {
      _getRecommend() {
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.recommendSliders = res.data.slider;
          }
        })
      },
      _getRecommendList() {
        getRecommendList().then(res => {
          if (res.code === ERR_OK) {
            this.discLists = res.data.list;
          }
        })
      },
      loadImage() {
        if (!this.isCheckLoaded) {
          this.$refs.scroll.refresh()
          this.isCheckLoaded = true
        }
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
        text-align: center
</style>
