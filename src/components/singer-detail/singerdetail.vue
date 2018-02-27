<template>
  <transition name="slide">
    <div class="singer-detail">
      <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </div>
  </transition>
</template>

<script>
/* eslint-disable */
import {mapGetters} from 'vuex'
import {getSingerDetail} from '../../api/singer'
import {ERR_OK} from "../../api/config";
import {createSong} from "../../common/js/song";
import MusicList from '../music-list/music-list'

export default {
      created(){
        this.initSingerDetai()
      },
      data(){
        return {
          songs:[]
        }
      },
      computed:{
        // 由于getters获取到的是结果，所以在computed中
        ...mapGetters([
          'singer'
        ]),
        title(){
          return this.singer.name
        },
        bgImage(){
          return this.singer.avatar
        }
      },
      methods:{
        initSingerDetai(){
          console.log(this.singer);
          if(!this.singer.id){
            this.$router.push('/singer')
            return
          }
          getSingerDetail(this.singer.id).then(res=>{
            if(res.code===ERR_OK){
              this.songs=this._normalizeSongs(res.data.list)
            }
          })
        },
        _normalizeSongs(list){
          let ret=[]
          list.forEach((item)=>{
            ret.push(createSong(item.musicData))
          })
          return ret
        }
      },
      components:{
        MusicList
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .singer-detail
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
