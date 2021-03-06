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
        <div class="middle"
             rel="middle"
             @touchstart.prevent="showTouchStart"
             @touchmove.prevent="showTouchMove"
             @touchend="showTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img :src="currentSong.image" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                {{playingLyric}}
              </div>
            </div>
          </div>
          <scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricScroll">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{current:currentLineNum===index}"
                   v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <div class="dot" :class="{'active':currentShow==='cd'}"></div>
            <div class="dot" :class="{'active':currentShow==='lyric'}"></div>
          </div>
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
              <i class="icon icon-favorite" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
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
        <div class="control" @click.stop="showList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list ref="list"></play-list>
    <audio ref="audio"
           :src="currentSong.url"
           @play="ready"
           @error="error"
           @timeupdate="updateTime"
           @ended="end"></audio>
  </div>
</template>

<script>
/* eslint-disable */
  import {mapGetters, mapMutations,mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from '../../common/js/dom'
  import ProgressBar from '../../base/progress-bar/progress-bar'
  import ProgressCircle from '../../base/progress-circle/progress-circle'
  import {playMode} from '../../common/js/config'
  import Lyric from 'lyric-parser'
  import Scroll from '../../base/scroll/scroll'
  import PlayList from '../../components/play-list/play-list'
import {playerMixin} from '../../common/js/mixin'

  const transform = prefixStyle('transform')
  const transitionDuration=prefixStyle('transitionDuration')
  export default {
    mixins:[playerMixin],
    name: "player",
    data() {
      return {
        isSongReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric:''
      }
    },
    created() {
      this.touch = {}
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
      percent() {
        return this.currentTime / this.currentSong.duration
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
      currentSong(newSong, oldSong) {
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong.id) {
          return
        }
        if(this.currentLyric){
          this.currentLyric.stop()
        }
        clearTimeout(this.timer)
        this.timer=setTimeout(()=>{
          this.$refs.audio.play()
          this.getCurrentLyric()
        },20)
      },
      playing(newPlayingState) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlayingState ? audio.play() : audio.pause()
        })
      }
    },
    methods: {
      showList(){
        this.$refs.list.show()
      },
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
        if(this.currentLyric){
          this.currentLyric.togglePlay()
        }
        this.setPlayingState(!this.playing)
      },
      getCurrentLyric() {
        this.currentSong.getLyric().then(lyric => {
          // if(this.currentSong.lyric===lyric){
          //   return
          // }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(err=>{
          this.currentLyric=null
          this.playingLyric=''
          this.currentLineNum=0
        })
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        const lyric = this.$refs.lyricLine
        if (lineNum > 5) {
          this.$refs.lyricScroll.scrollToElement(lyric[lineNum - 5], 1000)
        } else {
          this.$refs.lyricScroll.scrollTo(0, 0, 1000)
        }
        this.playingLyric=txt
      },
      prev() {
        if (!this.isSongReady) {
          return
        }
        if (this.playList.length === 1) {
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
      end() {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        this.setPlayingState(true)
        if(this.currentLyric){
          this.currentLyric.seek(0)
        }
      },
      next() {
        if (!this.isSongReady) {
          return
        }
        if (this.playList.length === 1) {
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
        this.savePlay(this.currentSong)
      },
      error() {
        this.isSongReady = true
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      showTouchStart(e) {
        this.touch.initialed = true
        this.touch.startX = e.touches[0].pageX
        this.touch.startY = e.touches[0].pageY
      },
      showTouchMove(e) {
        if (!this.touch.initialed) {
          return
        }
        let deltaX = e.touches[0].pageX - this.touch.startX
        let deltaY = e.touches[0].pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        let left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent=Math.abs(offsetWidth/window.innerWidth)
        this.$refs.lyricScroll.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricScroll.$el.style[transitionDuration]=0
        this.$refs.middleL.style.opacity=1-this.touch.percent
        this.$refs.middleL.style[transitionDuration]=0
      },
      showTouchEnd() {
        const time=400
        let offsetWid,opacity
        if(this.currentShow==='cd'){
          if(this.touch.percent>0.1){
            offsetWid=-window.innerWidth
            opacity=0
            this.currentShow='lyric'
          }else{
            offsetWid=0
            opacity=1
          }
        }else{
          if(this.touch.percent<0.9){
            offsetWid=0
            opacity=1
            this.currentShow='cd'
          }else{
            offsetWid=-window.innerWidth
            opacity=0
          }
        }
        this.$refs.lyricScroll.$el.style[transform] = `translate3d(${offsetWid}px,0,0)`
        this.$refs.middleL.style.opacity=opacity
        this.$refs.lyricScroll.$el.style[transitionDuration]=time+"ms"
        this.$refs.middleL.style[transitionDuration]=time+"ms"
        this.touch.initialed=false
      },
      onPercentChange(newPercent) {
        const currentTime = this.currentSong.duration * newPercent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        if(this.currentLyric){
          // 拖动progress，歌词同步
          this.currentLyric.seek(currentTime*1000)
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
      _format(time) {
        // 格式化time
        time = Math.round(time)
        let min = this._pad(Math.floor(time / 60))
        let second = this._pad(Math.floor(time % 60))
        return min + ':' + second
      },
      _pad(time, n = 2) {
        // 补位
        let len = time.toString().length
        while (len < n) {
          time = '0' + time
          len++
        }
        return time
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN_STATE',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX'
      }),
      ...mapActions([
        'savePlay'
      ])
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      PlayList
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
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
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
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-item: center
          width: 80%
          margin: 0 auto
          padding: 10px 0
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
          .icon-not-favorite
            color: $color-theme
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

