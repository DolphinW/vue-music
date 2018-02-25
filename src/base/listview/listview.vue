<template>
  <scroll :data="data"
          class="listview"
          ref="listScroll"
          @scroll="_scroll"
          :listenScroll="listenScroll"
          :probeType="probeType"
  >
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
        <p class="list-group-title">{{group.title}}</p>
        <ul>
          <li v-for="(item,ind) in group.items" :key="ind" class="list-group-item">
            <img v-lazy="item.avatar"  class="avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="list-shortcut">
      <li v-for="(item,index) in shotcut"
          @touchstart.stop.prevent="onShotcutStart"
          @touchmove.stop.prevent="onShotcutMove"
          :key="index"
          :data-index="index"
          :class="{current:currentIndex===index}"
          class="item" >
        {{item}}
      </li>
    </ul>
  </scroll>
</template>

<script>
/* eslint-disable */
  import Scroll from '../../base/scroll/scroll'
  import {getData} from '../../common/js/dom'

// 与样式统一每一个shotcut的高度
const SHOTCUT_HEIGHT=18

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    created(){
      this.touch={}
      this.listHeight=[]
      // 关系到listenScroll
      this.probeType=3
      this.listenScroll=true
    },
    data(){
      return {
        currentIndex:0,
        scrollY:-1
      }
    },
    computed:{
      shotcut(){
        return this.data.map(item=>{
          return item.title.substr(0,1)
        })
      }
    },
    watch:{
      data(){
        setTimeout(()=>{
          this._calculateHeight()
        },20)
      },
      scrollY(newVal){
        // 当滚动到顶部及弹性区域时
        if(newVal<=0){
          this.currentIndex=0
          return
        }
        for(let i =0; i<this.listHeight.length; i++){
          let y1=this.listHeight[i]
          let y2=this.listHeight[i+1]
          // 当滚动到底部及弹性区域时
          if(!y2){
            this.currentIndex=this.listHeight.length-1
            break
          }
          // 在中间正常区域滚动时
          if(newVal>y1 && newVal<y2){
            this.currentIndex=i
            break
          }
        }
      }
    },
    methods:{
      onShotcutStart(el){
        let anchorIndex=parseInt(getData(el.target,'index'))
        this.touch.startY=el.touches[0].pageY
        this.touch.startIndex=anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShotcutMove(el){
        this.touch.endY=el.touches[0].pageY
        let delta=Math.floor((this.touch.endY-this.touch.startY)/SHOTCUT_HEIGHT)
        let newIndex=this.touch.startIndex+delta
        this._scrollTo(newIndex)
      },
      _scroll(pos){
        this.scrollY=-pos.y
      },
      _scrollTo(index){
        if(index<0){
          index=0
        }else if(index>this.shotcut.length-1){
          index=this.shotcut.length-1
        }
        this.currentIndex=index
        this.$refs.listScroll.scrollToElement(this.$refs.listGroup[index],0)
      },
      _calculateHeight(){
        let height=0
        this.listHeight.push(height)
        for(let i=0;i<this.$refs.listGroup.length-1;i++){
          height+=this.$refs.listGroup[i].clientHeight
          this.listHeight.push(height)
        }
      }
    },
    components:{
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
