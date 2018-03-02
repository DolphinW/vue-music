<template>
  <transition name="slide">
    <div class="recommend-detail">
      <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </div>
  </transition>
</template>

<script>
/*eslint-disable*/
import MusicList from '../../components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from '../../api/recommend'
import {ERR_OK} from '../../api/config'
import {createSong} from '../../common/js/song'

  export default {
    name: "recommend-detail",
    data(){
      return {
        songs:[]
      }
    },
    created(){
      this._getSongList(this.diss.dissid)
    },
    computed:{
      title(){
        return this.diss.dissname
      },
      bgImage(){
        return this.diss.imgurl
      },
      ...mapGetters([
        'diss'
      ])
    },
    methods:{
      _getSongList(dissid){
        getSongList(dissid).then(res=>{
          let tmpRes=null
          if(typeof res==='string'){
            if(!res.slice(13, -1)){
              return
            }
            tmpRes=JSON.parse(res.slice(13, -1))
          }else{
            tmpRes=res
          }
          if(tmpRes.code===ERR_OK){
            this.songs=this._normalizeSongs(tmpRes.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs(list){
        let ret=[]
        list.forEach((item)=>{
          ret.push(createSong(item))
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

  .recommend-detail
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
