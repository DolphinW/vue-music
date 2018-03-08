<template>
  <div class="switches">
    <div v-for="(item,index) in data"
         @click="toggleSwitch(index)"
         class="item"
         :key="index"
         :class="{'current':currentSwitch===index}">
      {{item.name}}
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
  export default {
    name: "switches",
    props: {
      data: {
        type: Array,
        default: []
      },
      currentSwitch: {
        type: Number,
        default: 0
      }
    },
    methods: {
      toggleSwitch(index) {
        this.$emit('toggle', index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .switches
    height: 100%
    display: flex
    width: 100%
    border-radius: 5px
    .item
      flex: 1
      padding: 8px
      text-align center
      font-size: $font-size-medium
      color: $color-text
      border: 1px solid $color-highlight-background
      &.current
        background-color: $color-highlight-background
</style>
