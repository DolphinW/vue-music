<template>
  <div class="player-container" v-show="playList.length>0">
    <div class="normal-player" v-show="fullScreen">全屏</div>
    <div class="mini-player" v-show="!fullScreen">
      迷你
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {mapGetters} from 'vuex'

  export default {
    name: "player",
    computed:{
      ...mapGetters([
        'playList',
        'fullScreen'
      ])
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
</style>
