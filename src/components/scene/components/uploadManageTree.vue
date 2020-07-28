<template>
  <div class="asideTree bg-white">
    <div class="tops">
      <div class="title">
<!--        <i class="bg-primary"></i>-->
        目录树
      </div>
      <div class="tree__line"></div>
    </div>
    <el-tree
      class="filter-tree"
      ref="tree"
      :data="data"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <el-input v-model="data.label" readonly="readonly"></el-input>
        <span>
<!--          <el-button type="text"  @click="() => append(node, data)" class="el-icon-edit"></el-button>-->
          <el-button type="text"  @click="handleEditorNode(data)"
                     class="el-icon-edit" v-if="!data.file"></el-button>
          <el-button type="text"  @click="() => remove(node, data)"
                     class="el-icon-delete" v-if="!data.file"></el-button>
<!--          <el-dropdown>-->
<!--          <el-button type="text" class="el-icon-more"></el-button>-->
<!--          <el-dropdown-menu>-->
<!--            <el-dropdown-item>移动</el-dropdown-item>-->
<!--            <el-dropdown-item>重命名</el-dropdown-item>-->
<!--            <el-dropdown-item>删除</el-dropdown-item>-->
<!--            <el-dropdown-item>角色设置</el-dropdown-item>-->
<!--          </el-dropdown-menu>-->
<!--          </el-dropdown>-->
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
export default {
  name: 'uploadManageTree',
  data() {
    const data = [
      {
        id: 1,
        label: '上海路桥昆明路项目',
        children: [
          {
            id: 2,
            label: '场景模型',
            children: [
              {
                id: 3,
                label: '三级 1-1-1',
                file: true
              }
            ]
          }
        ]
      }
    ];
    return {
      id: 3,
      filterText: '',
      data: JSON.parse(JSON.stringify(data))
    };
  },
  methods: {
    handleEditorNode(data) {
      console.log(data);
    },
    append(node, data) {
      console.log(node);
      console.log(data);
      this.id++;
      if (node.level >= 4) {
        return this.$message.warning('最多可添加4级目录');
      }
      const newChild = { id: this.id++, label: 'testtest', children: [] };
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.asideTree {
  .title {
    margin-top: px2rem(24);
    font-size: px2rem(20);
    color: $treeColor;
  }
  .tops {
    border-bottom: 1px solid $bors;
    margin-left: px2rem(10);
    /*margin-top: px2rem(24);*/
    padding: px2rem(10);
    color: $selfTitle;
    font-size: px2rem(16);
    i {
      width: px2rem(3);
      height: px2rem(16);
      margin: 0 px2rem(5);
      display: inline-block;
    }
    /deep/ .el-input__inner {
      height: px2rem(35);
      border-radius: px2rem(20);
      background: $elInput;
      font-size: px2rem(12);
      margin-top: px2rem(14);
      padding: px2rem(4) px2rem(20);
    }
    .tree__line {
      width: px2rem(704);
      height: px2rem(0);
      border: $treeLine;
      opacity: 1;
    }
  }
  .el-tree {
    margin-top: px2rem(30);
    /deep/.el-tree-node__content:hover {
      color: $bluebor;
      border: 0 !important;
      /deep/ .el-input__inner {
        padding: px2rem(5);
        font-size: px2rem(14);
        height: px2rem(20);
        line-height: px2rem(20);
        border: none;
        outline: none;
        background: none;
      }
    }
    /deep/.el-tree-node:focus > .el-tree-node__content {
      color: $bluebor;
      background: $borderBg;
      border: 0 !important;
      /deep/ .el-input__inner {
        padding: px2rem(5);
        font-size: px2rem(14);
        height: px2rem(20);
        line-height: px2rem(20);
        border: none;
        outline: none;
        background: none;
      }
    }
    .custom-tree-node {
      width: 80%;
      display: inline-flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      /deep/ .el-input__inner {
        padding: px2rem(5);
        font-size: px2rem(14);
        height: px2rem(20);
        line-height: px2rem(20);
        border: none;
        outline: none;
      }
      /deep/ .el-button {
        margin-right: 5px
      }
    }
  }
}
</style>
