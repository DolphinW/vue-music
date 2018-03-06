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
        default:[]
      },
      listenScroll:{
        type:Boolean,
        default:false
      },
      pullup:{
        type:Boolean,
        default:false
      },
      beforeScroll:{
        type:Boolean,
        default:false
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

        if(this.listenScroll){
          let _this=this
          this.scroll.on('scroll',(position)=>{
            _this.$emit('scroll',position)
          })
        }


        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }
        // 用于监听滚动开始事件
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      enable(){
        this.scroll && this.scroll.enable()
      },
      disable(){
        this.scroll && this.scroll.disable()
      },
      refresh(){
        this.scroll && this.scroll.refresh()
      },
      scrollToElement(el,time){
        this.scroll && this.scroll.scrollToElement(el,time)
      },
      scrollTo(x,y,time){
        this.scroll && this.scroll.scrollTo(x,y,time)
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
