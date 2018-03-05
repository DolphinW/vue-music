<template>
  <div class="noResult">
    <div class="noResultIcon"></div>
    <p class="noResultText">{{title}}</p>
  </div>
</template>

<script>
/*eslint-disable*/
  export default {
    name: "no-result",
    props:{
      title:{
        type:String,
        default:'无结果'
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .noResult
    text-align: center
    .noResultIcon
      width: 86px
      height: 90px
      margin: 0 auto
      background-image:url('./no-result.png')
      background-size: 86px 90px
    .noResultText
      margin-top: 30px
      font-size: $font-size-medium
      color: $color-text-d
</style>
