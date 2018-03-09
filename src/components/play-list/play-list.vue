<template>
  <transition name="list-fade">
    <div class="play-list" v-show="showFlag" @click="hide">
      <div class="play-list-wrapper" @click.stop>
        <div class="header" >
          <h1 class="title">
            <i class="icon" :class="modeCls" @click="changePlayMode"></i>
            <span class="text">{{getCurrentModeText}}</span>
            <span class="clear" @click="clearAllSongs">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <Scroll :refreshDelay="refreshDelay" ref="listScroll" class="content" :data="sequenceList">
          <transition-group name="list" tag="ul" ref="list">
            <li class="item" v-for="(item,index) in sequenceList" :key="index" @click="selectItem(item,index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteItem(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
        <div class="operate">
          <div class="add" @click.stop="showAddSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="close" @click.stop="hide">
          <span>
            关闭
          </span>
        </div>
      </div>
      <add-song ref="addSong"></add-song>
      <confirm ref="confirm" text="是否要清空歌单列表？" confirm-btn-text="清空" @onConfirm="confirmClear"></confirm>
    </div>
  </transition>
</template>

<script>
/*eslint-disable*/
  import Scroll from '../../base/scroll/scroll'
  import Confirm from '../../base/confirm/confirm'
  import {mapActions} from 'vuex'
  import {playMode} from "../../common/js/config";
  import {playerMixin} from '../../common/js/mixin'
  import AddSong from '../../components/add-song/add-song'


export default {
  mixins:[playerMixin],
    name: "play-list",
    data(){
      return {
        showFlag:false,
        // 这个数值会影响添加歌曲后，在playlist中列表的显示
        refreshDelay:200
      }
    },
    computed:{
      getCurrentModeText(){
        return this.mode===playMode.random? '随机播放': this.mode===playMode.loop ?'单曲循环':'顺序播放'
      }
    },
    methods:{
      show(){
        this.showFlag=true
        // 解决滚动无效的问题
        setTimeout(()=>{
          this.$refs.listScroll.refresh()
          this._scrollToCurrentSong(this.currentSong)
        },20)
      },
      hide(){
        this.showFlag=false
      },
      showAddSong(){
        this.$refs.addSong.show()
      },
      deleteItem(item){
        this.deleteSong(item)
        if (!this.playList.length) {
          this.hide()
        }
      },
      selectItem(item,index){
        // 设置playList列表中的index
        if(this.mode===playMode.random){
          index=this.playList.findIndex((song)=>{
            return song.id===item.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      },
      getCurrentIcon(item){
        return item.id===this.currentSong.id ? 'icon-play':''
      },
      clearAllSongs(){
        this.$refs.confirm.open()
      },
      confirmClear(){
        // 清空所有列表
        this.deleteSongList()
        this.hide()
      },
      _scrollToCurrentSong(current){
        let sIndex=this.sequenceList.findIndex((song)=>{
          return song.id==current.id
        })
        this.$refs.listScroll.scrollToElement(this.$refs.list.$el.children[sIndex],300)
      },
      ...mapActions([
        'deleteSong',
        'deleteSongList'
      ])
    },
    watch:{
      currentSong(newSong,oldSong){
        if(!this.showFlag || newSong.id === oldSong.id){
          return
        }
        setTimeout(()=>{
          this._scrollToCurrentSong(newSong)
        },20)
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .play-list
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active,&.list-fade-leave-active
      transition: opacity .3s
      .play-list-wrapper
        transition:all .3s
    &.list-fade-enter,&.list-fade-leave-to
      opacity:0
      .play-list-wrapper
        transform:translate3d(0,100%,0)
    &.list-fade-enter
    .play-list-wrapper
      position:absolute
      bottom:0
      left:0
      width: 100%
      background-color: $color-highlight-background
      .header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l


</style>
