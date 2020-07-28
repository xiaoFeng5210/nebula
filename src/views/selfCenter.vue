<template>
  <div class="selfCenter">
    <el-container>
      <el-aside class="bg-white">
        <el-tree :data="sleftData" default-expand-all @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-container>
        <el-header class="bg-white">
          <el-row>
            <el-col :span="4" class="self-title">
              <i class="bg-primary"></i>
              {{titles[active]}}
            </el-col>
            <el-col :span="13"></el-col>
            <el-col :span="4" v-if="active==1">
              <el-input class="inputs" placeholder="请输入组织名称"></el-input>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="2" v-if="active==1">
              <el-select v-model="value" placeholder="参与程度">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-header>
        <el-main class="bg-white">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'selfCenter',
  data() {
    return {
      sleftData: [
        {
          label: '个人中心',
          children: [
            { label: '账户信息', id: 1, path: '/information' },
            { label: '我的项目', id: 2, path: '/projects' }
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
      titles: ['账户信息', '我的项目'],
      active: 0
    };
  },
  mounted() {},
  methods: {
    handleNodeClick(data) {
      this.active = data.id - 1;
      this.$router.push({ path: data.path });
    }
  }
};
</script>

<style lang="scss" scoped>
.selfCenter {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .el-container {
    .el-aside {
      width: px2rem(240) !important;
      height: 99vh;
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
    }
    .el-header {
      height: px2rem(60) !important;
      line-height: px2rem(60);
      margin-left: px2rem(10);
      padding: 0 px2rem(10);
      .el-col {
        padding: px2rem(1);
        i {
          width: px2rem(4);
          height: px2rem(16);
          margin: 0 px2rem(5);
          display: inline-block;
        }
        .self-title {
          color: $selfTitle;
          font-size: px2rem(18);
        }
      }
      /deep/ .el-input__inner {
        height: px2rem(34);
        line-height: px2rem(34);
        font-size: px2rem(12);
        color: $inputplace !important;
      }
      .el-col-1 {
        width: 2.5% !important;
      }
    }
    .el-main {
      margin: px2rem(10);
      padding: 0 px2rem(10);
    }
  }
}
</style>
