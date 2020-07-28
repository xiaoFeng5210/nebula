<template>
  <div class="projectSet">
    <el-container>
      <el-aside class="bg-white">
        <el-tree :data="sleftData" default-expand-all @node-click="handleNodeClick">
          <span slot-scope="{ node, data }">
            <i :class="data.icon"></i>
            <span style="padding-left: 4px;">{{node.label}}</span>
          </span>
        </el-tree>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'projectSet',
  data() {
    return {
      isButtonActive: false,
      sleftData: [
        {
          label: '人员设置',
          icon: 'el-icon-user-solid',
          children: [
            { label: '项目人员', id: 1, path: '/personSet' },
            { label: '人员审核', id: 2, path: '/projectSets' }
          ]
        },
        {
          label: '项目设置',
          icon: 'el-icon-s-tools',
          children: [
            { label: '基本信息', id: 3, path: '/baseinfo' },
            // { label: '资料管理', id: 4, path: '/datamanage' },
            { label: '配置设置', id: 5, path: '/configset' },
            { label: '日志管理', id: 6, path: '/logmanage' }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: '',
      titles: [
        { tab: '项目人员', id: 0 },
        { tab: '人员审核', id: 1 },
        { tab: '基本信息', id: 2 },
        { tab: '资料管理', id: 3 },
        { tab: '配置设置', id: 4 },
        { tab: '日志管理', id: 5 }
      ],
      active: 0
    };
  },
  created() {
    const self = this;
    self.$nextTick(() => {
      switch (self.$route.path) {
      case '/PersonSet':
        self.active = 0;
        break;
      case '/projectSets':
        self.active = 1;
        break;
      case '/baseinfo':
        self.active = 2;
        break;
      case '/datamanage': // 改成资料管理
        self.active = 3;
        break;
      case '/configset':
        self.active = 4;
        break;
      case '/logmanage':
        self.active = 5;
        break;
      default:
      }
    });
  },
  methods: {
    handleNodeClick(data) {
      this.active = data.id - 1;
      this.$router.push({ path: data.path });
    }
  }
};
</script>

<style lang="scss" scoped>
.projectSet {
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
      margin:0 px2rem(10);
      padding: 0;
    }
  }
}
</style>
