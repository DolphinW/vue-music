<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
        <slot></slot>
    </div>
  </transition>
</template>

<script>
/*eslint-disable*/
  export default {
    name: "top-tip",
    data(){
      return {
        showFlag:false
      }
    },
    props:{
      closeDelay:{
        type:Number,
        default:2000
      }
    },
    methods:{
      show(){
        this.showFlag=true
        clearTimeout(this.timer)
        this.timer=setTimeout(()=>{
          this.hide()
        },this.closeDelay)
      },
      hide(){
        this.showFlag=false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .top-tip
    position:fixed
    top:0
    width: 100%
    background-color:$color-dialog-background
    font-size:$font-size-medium
    color: $color-text
    padding:20px 0
    text-align:center
</style>
