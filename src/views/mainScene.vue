<template>
  <el-container class="mainScene">
    <el-main>
      <div class="main-container d-flex jc-start">
        <div class="left-tree" v-if="!fullscreen">
          <el-tree :data="mainScene" default-expand-all @node-click="handleNodeClick">
            <span slot-scope="{ node, data }">
              <i :class="data.icon"></i>
              <span style="padding-left: 4px;">{{node.label}}</span>
            </span>
          </el-tree>
        </div>
        <div class="flex-grow-1" :class="{'subitems':rim,'alls':fullscreen}" :fullscreen="fullscreen">
          <router-view></router-view>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'mainScene',
  data() {
    return {
      mainScene: [
        {
          label: '场景管理',
          icon: 'el-icon-menu',
          children: [{ label: '全景展示', id: 1, path: '/scene' }]
        },
        {
          label: '模型管理',
          icon: 'el-icon-orange',
          children: [
            // { label: '目录树管理', id: 1, path: '/menuTree' },
            { label: '上传管理', id: 2, path: '/uploadManage' },
            { label: '资源管理', id: 3, path: '/resource' }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      active: 1,
      fullscreen: false,
      models: true,
      rim: false,
      titles: {
        tab: ''
      }
    };
  },
  created() {
    if (document.getElementById('RealBIMWeb') !== null) {
      this.modules = false;
    }
  },
  mounted() {},
  methods: {
    handleNodeClick(data) {
      this.titles.tab = data.label;
      this.active = data.id - 1;
      this.$router.push({ path: data.path });
    }
  },
  computed: {
    msg() {
      return this.$store.state.user.fullscreen;
    }
  },
  watch: {
    $route: function(val) {
      if (val.name === 'scene') {
        this.rim = false;
      } else {
        this.rim = true;
      }
    },
    msg() {
      this.fullscreen = !this.fullscreen;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .left-tree {
    width: px2rem(300);
  }
  .el-tree {
    min-height: 93vh;
    font-size: px2rem(14);
  }
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
  .el-header {
    padding: 0;
    height: px2rem(77) !important ;
  }
  .el-main {
    padding: 0;
    .main-container {
      .subitems {
        .header {
          height: px2rem(60) !important;
          line-height: px2rem(60);
          margin-left: px2rem(10);
          padding: 0;
        }
      }
    }
  }
}
.el-container.is-vertical {
  height: 100%;
}
#model {
  display: none;
}
</style>
