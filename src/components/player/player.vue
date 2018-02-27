<template>
  <div class="player-container" v-show="playList.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="bg">
          <img width="100%" height="100%" :src="songInfo.image">
        </div>
        <div class="top">
          <div class="back" @click="closeFullScreen">
            <i class="icon icon-back"></i>
          </div>
          <h1 class="title" v-html="songInfo.name"></h1>
          <h2 class="subtitle" v-html="songInfo.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img :src="songInfo.image" class="image">
              </div>
            </div>
          </div>
          <div class="middle-r">

          </div>
        </div>
        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <i class="icon icon-loop"></i>
            </div>
            <div class="icon i-left">
              <i class="icon icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i class="icon icon-play"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini" >
      <div class="mini-player" v-show="!fullScreen" @click="openFullScreen">
        <div class="icon">
          <img :src="songInfo.image" width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name" v-html="songInfo.name"></h2>
          <p class="desc" v-html="songInfo.singer"></p>
        </div>
        <div class="control">
          <i class="icon-mini"></i>
        </div>
        <div class="control" >
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
import {mapGetters,mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from '../../common/js/dom'

const transform=prefixStyle('transform')

  export default {
    name: "player",
    computed:{
      ...mapGetters([
        'playList',
        'fullScreen',
        'songInfo'
      ])
    },
    methods:{
      closeFullScreen(){
        this.setFullScreen(false)
      },
      openFullScreen(){
        this.setFullScreen(true)
      },
      enter(el,done){
        // 从小飞到大的动画
        const {x,y,scale}=this._getPosAndScale()

        let animation={
          0:{
            transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60:{
            transform:`translate3d(0,0,0) scale(1.1)`
          },
          100:{
            transform:`translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name:'move',
          animation,
          presets:{
            duration:400,
            easing:'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper,'move',done)

      },
      afterEnter(){
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation=''
      },
      leave(el,done){
        this.$refs.cdWrapper.style['transition']='all 0.4s'
        const {x,y,scale}=this._getPosAndScale()
        this.$refs.cdWrapper.style[transform]=`translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend',done)
      },
      afterLeave(){
        this.$refs.cdWrapper.style['transition']=''
        this.$refs.cdWrapper.style[transform]=''
      },
      _getPosAndScale(){
        const targetWidth=40
        const targetLeftDistance=40
        const targetBottomDistance=30
        const paddingTop=80
        const cdWidth=window.innerWidth*0.8
        const scale=targetWidth/cdWidth
        const x=-(window.innerWidth/2-targetLeftDistance)
        const y=window.innerHeight-paddingTop-cdWidth/2-targetBottomDistance
        return {
          x,
          y,
          scale
        }
      },
      ...mapMutations({
        setFullScreen:'SET_FULL_SCREEN_STATE'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import "~common/stylus/mixin"

  .player-container
    .normal-player
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      z-index 150
      background-color: $color-background
      .bg
        position:absolute
        top:0
        left:0
        width: 100%
        height: 100%
        z-index: -1
        opacity:0.6
        filter:blur(20px)

      .top
        position relative
        margin-bottom:25px
        .back
          position absolute
          top:0
          left:6px
          z-index:50
          .icon-back
            display: block
            padding:9px
            font-size:$font-size-large-x
            color:$color-theme
            transform:rotate(-90deg)
        .title
          width: 70%
          margin:0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position:fixed
        width:100%
        top:80px
        bottom:170px
        white-space:nowrap
        font-size:0
        .middle-l
          display: inline-block
          vertical-align top
          position:relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position absolute
            left: 10%
            top:0
            width: 80%
            height:100%
            .cd
              width: 100%
              height: 100%
              box-sizing:border-box
              border:10px solid rgba(255,255,255,0.1)
              border-radius:50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background-color: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
</style>
