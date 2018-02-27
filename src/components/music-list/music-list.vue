<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">
      {{title}}
    </h1>
    <div class="bgImage" ref="bgImage" :style="setBgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <!--设置层 让其有随着滚动的效果-->
    <div class="layer" ref="layer"></div>
    <scroll :data="songs"
            :probe-type="probeType"
            :listen-scroll="listenScroll"
            @scroll="onScroll"
            class="list"
            ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectSong" :songs="songs"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
/* eslint-disable */
import Scroll from '../../base/scroll/scroll'
import SongList from '../../base/song-list/song-list'
import Loading from '../../base/loading/loading'
import {prefixStyle} from '../../common/js/dom'
import {mapActions} from 'vuex'

const PRESERVE_SPACE=40
// 为了便于js中兼容性的设置样式，封装了一个通过能力检测获取的属性名，来设置样式
const transform=prefixStyle('transform')
const backDropFilter=prefixStyle('backDropFilter')

  export default {
    name: "music-list",
    data(){
      return {
        scrollY:0
      }
    },
    props:{
      title:{
        type:String,
        default:"默认标题"
      },
      bgImage:{
        type:String,
        default:''
      },
      songs:{
        type:Array,
        default:[]
      }
    },
    created(){
      this.probeType=3
      this.listenScroll=true
    },
    mounted(){
      this.bgImageHeight=this.$refs.bgImage.clientHeight
      // 向上最多滚动的距离，留出了header的高度
      this.minScrollY=-this.bgImageHeight+PRESERVE_SPACE
      // 计算背景图的高度设置顶部位移量，注意这里获取到的list是 一个vue component对象，需要$el获取dom对象
      this.$refs.list.$el.style.top=this.bgImageHeight+'px'
      this.$refs.layer.style.top=this.bgImageHeight+'px'

    },
    computed:{
      setBgImage(){
        return `backgroundImage:url(${this.bgImage})`
      }
    },
    methods:{
      ...mapActions([
        'setPlay'
      ]),
      goBack(){
        this.$router.back()
      },
      onScroll(pos){
        this.scrollY=pos.y
      },
      selectSong(song,index){
        // 根据需求传递值，但对于base组件来说，自己应传什么传什么，与外部业务不必一至。
        // 通过执行action，提交mutation，设置state的值
        this.setPlay({
          list:this.songs,
          index:index
        })
      }
    },
    watch:{
      scrollY(newVal){
        let translateY=Math.max(this.minScrollY,newVal)
        // 一、层 随着list滚动效果 以及 ios手机高斯模糊效果
        // 二、下拉列表时，bgImage放大效果
        const percent=Math.abs(newVal/this.bgImageHeight)
        let zIndex=0
        let blur=0
        let scale=1
        if(newVal>0){
          scale=scale+percent
          // zIndex=10
        }else{
          blur=Math.min(20,percent*20)
        }
        this.$refs.layer.style[transform]=`translate3d(0,${translateY}px,0)`
        // 解决list滚出层的样式问题，修改bgImage的zIndex，用于遮挡;
        // 但由于图片过高，导致遮挡区域太大，故同时需要修改图片的高度;
        // 同时需要显示/隐藏播放器元素
        if(newVal<this.minScrollY){
          zIndex=10
          this.$refs.bgImage.style['paddingTop']=0
          this.$refs.bgImage.style['height']=PRESERVE_SPACE+'px'
          this.$refs.playBtn.style['display']='none'
        }else{
          this.$refs.bgImage.style['paddingTop']='70%'
          this.$refs.bgImage.style['height']=0
          this.$refs.playBtn.style['display']=''
        }
        this.$refs.bgImage.style['zIndex']=zIndex
        // 下拉放大
        this.$refs.bgImage.style[transform]=`scale(${scale})`
        // 上拉模糊，只在ios手机有效
        this.$refs.bgImage.style[backDropFilter]=`blur(${blur})`
      }
    },
    components:{
      Scroll,
      SongList,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import "~common/stylus/mixin"

  .music-list
    position:fixed
    top:0
    left:0
    right:0
    bottom:0
    background-color: $color-background
    .back
      position:absolute
      top:0
      left:6px
      z-index:50
      i
        display:block
        padding:10px
        font-size:$font-size-large
        color:$color-theme
    .title
      position:absolute
      left:10%
      top:0
      width: 80%
      no-wrap()
      text-align:center
      line-height:40px
      z-index:40
      font-size: $font-size-large
      color: $color-text
    .bgImage
      position:relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin:top
      background-size:cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
    .layer
      position fixed
      top 0
      bottom 0
      width: 100%
      background-color: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        text-align center
        transform: translateY(-50%)

</style>
