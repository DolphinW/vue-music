<template>
  <div class="player-container" v-show="playList.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="bg">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="closeFullScreen">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img :src="currentSong.image" class="image">
              </div>
            </div>
          </div>
          <div class="middle-r">

          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{_format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onPercentChange"></progress-bar>
            </div>
            <span class="time time-r">{{_format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changePlayMode">
              <i :class="modeCls"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev()" class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next()" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="openFullScreen">
        <div class="icon">
          <img :class="cdCls" :src="currentSong.image" width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" :class="miniIcon" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio"
           :src="currentSong.url"
           @canplay="ready"
           @error="error"
           @timeupdate="updateTime"
           @ended="end"></audio>
  </div>
</template>

<script>
/* eslint-disable */
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from '../../common/js/dom'
  import ProgressBar from '../../base/progress-bar/progress-bar'
  import ProgressCircle from '../../base/progress-circle/progress-circle'
  import {playMode} from '../../common/js/config'
  import {shuffle} from '../../common/js/utils'

  const transform = prefixStyle('transform')

  export default {
    name: "player",
    data() {
      return {
        isSongReady: false,
        currentTime:0,
        radius:32
      }
    },
    computed: {
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      disableCls() {
        return this.isSongReady ? '' : 'disable'
      },
      percent(){
        return this.currentTime/this.currentSong.duration
      },
      modeCls(){
        return this.mode===playMode.sequence?'icon-sequence':this.mode===playMode.loop?'icon-loop':'icon-random'
      },
      ...mapGetters([
        'playList',
        'fullScreen',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    watch: {
      currentSong(newSong,oldSong) {
        if(!newSong.id){
          return
        }
        if(newSong.id===oldSong.id){
          return
        }
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
      },
      playing(newPlayingState) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlayingState ? audio.play() : audio.pause()
        })
      }
    },
    methods: {
      closeFullScreen() {
        this.setFullScreen(false)
      },
      openFullScreen() {
        this.setFullScreen(true)
      },
      togglePlaying() {
        if (!this.isSongReady) {
          return
        }
        this.setPlayingState(!this.playing)
      },
      changePlayMode(){
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex(list){
        let index=list.findIndex((item)=>{
          return item.id===this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      prev() {
        if (!this.isSongReady) {
          return
        }
        if(this.mode===playMode.loop){
          this.loop()
          return
        }
        let index = this.currentIndex - 1
        if (index <= -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.isSongReady = false
      },
      end(){
        if(this.mode===playMode.loop){
          this.loop()
        }else{
          this.next()
        }
      },
      loop(){
        this.$refs.audio.currentTime=0
        this.$refs.audio.play()
        this.setPlayingState(true)
      },
      next() {
        if (!this.isSongReady) {
          return
        }
        if(this.mode===playMode.loop){
          this.loop()
          return
        }
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.isSongReady = false
      },
      ready() {
        this.isSongReady = true
      },
      error() {
        this.isSongReady = true
      },
      updateTime(e){
        this.currentTime=e.target.currentTime
      },
      onPercentChange(newPercent){
        const currentTime = this.currentSong.duration * newPercent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
      },
      enter(el, done) {
        // js使用动画的四个钩子函数，实现动画：从小飞到大的动画
        const {x, y, scale} = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)

      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style['transition'] = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style['transition'] = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      _getPosAndScale() {
        const targetWidth = 40
        const targetLeftDistance = 40
        const targetBottomDistance = 30
        const paddingTop = 80
        const cdWidth = window.innerWidth * 0.8
        const scale = targetWidth / cdWidth
        const x = -(window.innerWidth / 2 - targetLeftDistance)
        const y = window.innerHeight - paddingTop - cdWidth / 2 - targetBottomDistance
        return {
          x,
          y,
          scale
        }
      },
      _format(time){
        // 格式化time
        time=Math.round(time)
        let min=this._pad(Math.floor(time/60))
        let second=this._pad(Math.floor(time%60))
        return min+':'+second
      },
      _pad(time,n=2){
        // 补位
        let len=time.toString().length
        while(len<n){
          time='0'+time
          len++
        }
        return time
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN_STATE',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode:'SET_PLAY_MODE',
        setSequenceList:'SET_SEQUENCE_LIST',
        setPlayList:'SET_PLAY_LIST'
      })
    },
    components: {
      ProgressBar,
      ProgressCircle
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
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
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
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state paused
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
        .progress-wrapper
          display: flex
          align-item:center
          width: 80%
          margin:0 auto
          padding:10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
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
          &.play
            animation: rotate 20s linear infinite
          &.pause
            animation-play-state paused
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

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)

</style>

