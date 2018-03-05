<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" :placeholder="placeholder" v-model="query"/>
    <i class="icon-dismiss" v-show="query" @click="clearQuery"></i>
  </div>
</template>

<script>
/*eslint-disable*/
  export default {
    name: "search-box",
    data(){
      return {
        query:''
      }
    },
    created(){
      //为啥一定要用这种形式watcher？
      this.$watch('query',(newVal)=>{
        this.$emit('updateQuery',newVal)
      })
    },
    props:{
      placeholder:{
        type:String,
        default:'请输入搜索内容'
      }
    },
    methods:{
      clearQuery(){
        this.query=''
      },
      setQuery(newQuery){
        this.query=newQuery
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      outline:none
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
