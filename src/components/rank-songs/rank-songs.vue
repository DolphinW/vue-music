<template>
  <transition name="slide">
    <div class="rank-songs">
      <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </div>
  </transition>
</template>

<script>
/*eslint-disable*/
import MusicList from '../music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from '../../api/rank'
import {ERR_OK} from '../../api/config'
import {createSong} from '../../common/js/song'

  export default {
    name: "rank-songs",
    data(){
      return {
        songs:[]
      }
    },
    created(){
      this._getSongList(this.rank.id)
    },
    computed:{
      title(){
        return this.rank.topTitle
      },
      bgImage(){
        if(this.songs.length){
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'rank'
      ])
    },
    components:{
      MusicList
    },
    methods:{
      _getSongList(topid){
        if(!this.rank.id){
          this.$router.push({
            path:'/rank'
          })
          return
        }
        getSongList(topid).then(res=>{
          if(res.code===ERR_OK){
            this.songs=this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs(list){
        let ret=[]
        list.forEach((item) => {
          const musicData = item.data
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .rank-songs
    position:fixed
    top:0
    left:0
    right:0
    bottom:0
    background-color: $color-background
    z-index:100
  .slide-enter-active,.slide-leave-active
    transition:all 0.3s

  .slide-enter,.slide-leave-to
    transform:translate3d(100%,0,0)
</style>
