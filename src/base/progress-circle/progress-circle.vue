<template>
  <div class="progress-circle">
    <svg width="100%" height="100%" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" cx="50" cy="50" r="50" stroke="black" fill="transparent"/>
      <circle class="progress-bar" cx="50" cy="50" r="50" stroke="black" fill="transparent" stroke-dasharray="10%"
              stroke-dashoffset="10%"/>
    </svg>
  </div>
</template>

<script>
    export default {
        name: "progress-circle"
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
