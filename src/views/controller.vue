<template>
  <div class="controller">
    <div class="tops bg-white d-flex ai-center jc-start text-center">
      <div
        class="tabs el-icon-menu"
        :class="{'active':active==0}"
        @click="changeTab(0,'controller')"
      >全部</div>
      <div
        class="tabs el-icon-star-on"
        :class="{'active':active==1}"
        @click="changeTab(1,'collect')"
      >个人收藏</div>
      <div
        class="tabs el-icon-delete-solid"
        :class="{'active':active==2}"
        @click="changeTab(2,'recycle')"
      >回收站</div>
    </div>
    <main class="container">
      <router-view></router-view>
    </main>
  </div>
</template>
<script>
export default {
  name: 'controller',
  data() {
    return {
      active: 0
    };
  },
  methods: {
    changeTab(num, paths) {
      this.active = num;
      this.$router.push({ name: paths });
      console.log(this.active);
    }
  }
};
</script>

<style lang="scss" scoped>
.controller {
  position: relative;
  width: 100%;
  min-height: 100vh;
  .tops {
    height: px2rem(60);
    line-height: px2rem(60);
    margin-left: px2rem(10);
    cursor: pointer;
    .tabs {
      width: px2rem(100);
      height: px2rem(24);
      line-height: px2rem(24);
      font-size: px2rem(16);
      color: $topsFont;
      border-right: px2rem(1) solid $topsFont;
    }
    .tabs::before {
      margin-right: px2rem(2);
      font-size: px2rem(20);
    }
    .active {
      color: $font;
    }
    .tabs:last-child {
      border: none;
    }
  }
  .container {
    min-height: calc(100vh - 7.3rem);
    padding: px2rem(10);
  }
}
</style>
