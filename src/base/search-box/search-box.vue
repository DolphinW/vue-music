<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="queryIpt" class="box" :placeholder="placeholder" v-model="query"/>
    <i class="icon-dismiss" v-show="query" @click="clearQuery"></i>
  </div>
</template>

<script>
/*eslint-disable*/
import {debounce} from '../../common/js/utils'

  export default {
    name: "search-box",
    data(){
      return {
        query:''
      }
    },
    created(){
      // 优化，节约流量
      //为啥一定要用这种形式watcher？
      // 原因：用于节流，免于在每多一个字符或删除一个字符都会发送请求！
      this.$watch('query',debounce((newVal)=>{
        this.$emit('updateQuery',newVal)
      },200))
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
      // 组件的方法可以在外调用
      setQuery(newQuery){
        this.query=newQuery
      },
      blur(){
        // 调用input的失去焦点事件
        this.$refs.queryIpt.blur()
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
