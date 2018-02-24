<template>
  <div ref="scrollWrapper">
    <slot></slot>
  </div>
</template>

<script>

/* eslint-disable */
  import BScroll from "better-scroll"

  export default {
    name: "scroll",
    props:{
      probeType:{
        type:Number,
        default:1
      },
      click:{
        type:Boolean,
        default:true
      },
      // 用于重新计算滚动区域的高度
      data:{
        type:Array,
        default:null
      }
    },
    mounted(){
      this.$nextTick(()=>{
        this.initScroll()
      })
    },
    methods:{
      initScroll(){
        if(!this.$refs.scrollWrapper){
          return
        }
        this.scroll=new BScroll(this.$refs.scrollWrapper,{
          probeType:this.probeType,
          click:this.click
        })
      },
      enable(){
        this.scroll && this.scroll.enable()
      },
      disable(){
        this.scroll && this.scroll.disable()
      },
      refresh(){
        this.scroll && this.scroll.refresh()
      }
    },
    watch:{
      data(){
        // 注意：这里需要$nextTick，否则滚动无效。
        this.$nextTick(()=>{
          this.refresh()
        })
      }
    }
  }
</script>

<style scoped rel="stylesheet/stylus" lang="stylus">

</style>
