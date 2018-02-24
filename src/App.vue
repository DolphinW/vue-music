<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!--避免切换时的冗余请求-->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
export default {
  components: {
    MHeader,
    Tab
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
