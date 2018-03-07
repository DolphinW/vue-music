<template>
  <transition name="list-fade">
    <div class="play-list">
      <div class="play-list-wrapper">
        <div class="header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <div class="content">
          <ul>
            <li class="item">
              <i class="current"></i>
              <span class="text"></span>
              <span class="like">
                <i class="icon-favorite"></i>
              </span>
              <span class="delete">
                <i class="icon-delete"></i>
              </span>
            </li>
          </ul>
        </div>
        <div class="operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="close">
          <span>
            关闭
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
/*eslint-disable*/
  import Scroll from '../../base/scroll/scroll'
  import Confirm from '../../base/confirm/confirm'

  export default {
    name: "play-list",
    components: {
      Scroll,
      Confirm
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .play-list
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active,&.list-fade-leave-active
      transition: opacity 4s
      .play-list-wrapper
        transition:all 4s
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
