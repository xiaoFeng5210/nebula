<template>
  <div class="tablePage">
    <el-container>
      <el-aside class="bg-white">
        <el-menu
        :default-active="this.$route.path"
        router
        >
          <el-menu-item index="/backlog">
            <i class="el-icon-document"></i>
            <span slot="title">待办事项</span>
          </el-menu-item>
          <el-menu-item index="/news">
            <i class="el-icon-position"></i>
            <span slot="title">最新动态</span>
          </el-menu-item>
          <el-menu-item index="/notice">
            <i class="el-icon-s-cooperation"></i>
            <span slot="title">通知公告</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'tablePage',
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.tablePage{
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .el-container{
    .el-aside{
      width: px2rem(240) !important;
      height: 99vh;
      box-shadow:0px 3px 6px rgba(0,0,0,0.1);
      /deep/.el-menu-item{
        height: px2rem(48);
        line-height: px2rem(48);
      }
      /deep/.el-menu-item:hover {
        color: $bluebor;
        border-right: px2rem(2) solid $bluebor;
      }
      /deep/.el-menu-item.is-active {
        color: $bluebor;
        border-right: px2rem(2) solid $bluebor;
      }
    }
    .el-main{
      padding: 0 !important;
    }
  }
}
</style>
