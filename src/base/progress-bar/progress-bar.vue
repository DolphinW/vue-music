<template>
  <div class="progress-bar" ref="progressBar" @click="onProgressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart.prevent="onTouchStart"
           @touchmove.prevent="onTouchMove"
           @touchend="onTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import {prefixStyle} from "../../common/js/dom";

  const progressBtnWidth = 16
  const transform = prefixStyle('transform')

  export default {
    name: "progress-bar",
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created(){
      this.touch={}
    },
    watch: {
      percent(newVal) {
        if (newVal >= 0 && !this.touch.initPercent) {
          const progressWid = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWid = newVal * progressWid
          this._offset(offsetWid)
        }
      }
    },
    methods: {
      onTouchStart(e){
        this.touch.initPercent=false
        this.touch.startX=e.touches[0].pageX
        this.touch.startOffset=this.$refs.progress.clientWidth
      },
      onTouchMove(e){
        this.touch.initPercent=true
        const deltaX=e.touches[0].pageX-this.touch.startX
        const newOffset=Math.min(this.$refs.progressBar.clientWidth,Math.max(0,deltaX+this.touch.startOffset))
        this._offset(newOffset)
        this._triggerPercent()
      },
      onTouchEnd(e){
        this.touch.initPercent=false
      },
      onProgressClick(e){
        const offsetLeft=e.pageX-this.$refs.progressBar.offsetLeft-progressBtnWidth/2
        this._offset(offsetLeft)
        this._triggerPercent()
      },
      _offset(distance) {
        this.$refs.progress.style.width = distance + 'px'
        this.$refs.progressBtn.style[transform] = `translate3d(${distance}px,0,0)`
      },
      _triggerPercent(){
        const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
        const newPercent=this.$refs.progress.clientWidth/barWidth
        this.$emit('percentChange',newPercent)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
