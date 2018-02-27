<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song,index)" v-for="(song,index) in songs" :key="index">
        <div class="rank">

        </div>
        <div class="songInfo">
          <div class="song-name" v-html="song.name"></div>
          <div class="singer-name" v-html="song.singer"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: "song-list",
    props:{
      songs:{
        type:Array,
        default:[]
      }
    },
    methods:{
      selectItem(song,index){
        this.$emit('select',song,index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import "~common/stylus/mixin"

  .song-list
    ul
      li
        display:flex
        align-items: center
        box-sizing: border-box
        height: 64px
        font-size: $font-size-medium
        .rank
          flex:0 0 25px
          width: 25px
          margin-right: 30px
          text-align: center
        .songInfo
          flex:1
          line-height: 20px
          overflow: hidden
          .song-name
            no-wrap()
            color: $color-text
          .singer-name
            no-wrap()
            margin-top: 4px
            color: $color-text-d
</style>
