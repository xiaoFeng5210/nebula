<template>
  <div class="firmManage">
    <el-container>
      <el-aside class="bg-white">
        <el-tree :data="sleftData" default-expand-all @node-click="handleNodeClick">
          <span slot-scope="{ node, data }">
            <i :class="data.icon"></i>
            <span style="padding-left: 4px;">{{node.label}}</span>
          </span>
        </el-tree>
      </el-aside>
      <el-container>
        <el-main>
          <router-view ref="child"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import firmHeader from '@/components/comModule/firmHeader';
export default {
  name: 'FirmManage',
  components: {
    firmHeader
  },
  data() {
    return {
      sleftData: [
        {
          label: '企业管理',
          icon: 'el-icon-user-solid',
          children: [
            { label: '角色管理', id: 1, path: '/roleManage' },
            { label: '人员管理', id: 2, path: '/memberManage' },
            { label: '组织管理', id: 3, path: '/organization' },
            { label: '套餐管理', id: 4, path: '/comboManage' }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      value: '',
      titles: [
        { tab: '角色管理', id: 0 },
        { tab: '人员管理', id: 1 },
        { tab: '组织管理', id: 2 },
        { tab: '套餐管理', id: 3 }
      ],
      active: 0
    };
  },
  created() {
    const self = this;
    self.$nextTick(() => {
      switch (self.$route.path) {
      case '/roleManage':
        self.active = 0;
        break;
      case '/memberManage':
        self.active = 1;
        break;
      case '/organization':
        self.active = 2;
        break;
      case '/comboManage': // 改成资料管理
        self.active = 3;
        break;
      default:
      }
    });
  },
  methods: {
    handleNodeClick(data) {
      this.active = data.id - 1;
      this.$router.push({ path: data.path });
    },
    addUsers() {
      this.$refs.child.addItem();
    }
  }
};
</script>
<style lang="scss" scoped>
.firmManage {
  position: relative;
  width: 100vw;
  height: 100vh;
  .el-container {
    .el-aside {
      width: px2rem(240) !important;
      height: calc(100vh - 4.1rem);
      padding: 0 px2rem(10);
      font-size: px2rem(14);
      /deep/.el-tree-node__content {
        height: px2rem(48);
        line-height: px2rem(48);
        padding: px2rem(10) 0;
      }
      /deep/.el-tree-node__content:hover {
        color: $bluebor;
        border-right: px2rem(2) solid $bluebor;
      }
      /deep/.el-tree-node:focus > .el-tree-node__content {
        color: $bluebor;
        background: $borderBg;
        border-right: px2rem(2) solid $bluebor;
      }
      .el-tree {
        margin-top: px2rem(10);
      }
    }
    .aside-tree {
      width: px2rem(264) !important;
      margin-left: px2rem(10);
      height: calc(100vh - 4.4rem) !important;
    }
    .el-header {
      height: px2rem(60) !important;
      line-height: px2rem(60);
      margin-left: px2rem(10);
      padding: 0;
    }
    .el-main {
      margin: px2rem(10);
      padding: 0;
    }
  }
}
</style>
