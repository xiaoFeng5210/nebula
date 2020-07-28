<template>
  <div class="menuTree">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="4" class="self-title">
            <i class="bg-primary"></i>
            目录树管理
          </el-col>
          <el-col :span="4" :offset="16" class="self-title">
            <el-button type="primary">新增目录</el-button>
            <el-button type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <!-- icon-class="el-icon-minus" -->
        <el-tree
          :data="data"
          node-key="id"
          default-expand-all
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <!-- <el-input v-model="data.label" readonly="readonly"></el-input> -->
            <el-input v-model="data.label" readonly="readonly"></el-input>
            <span>
              <el-button
                type="text"
                @click="() => append(node, data)"
                class="el-icon-edit"
              ></el-button>
              <!--          <el-button type="text"  @click="() => remove(node, data)" class="el-icon-remove-outline"></el-button>-->
              <el-button type="text" class="el-icon-delete"></el-button>
              <el-button type="text" class="el-icon-rank"></el-button>
            </span>
          </span>
        </el-tree>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import {} from '../../api/proApi/aboutengin'
export default {
  name: 'menuTree',
  data() {
    return {
      data: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  methods: {
    handleDragStart(node, ev) {
      console.log('drag start', node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner';
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
    }
  }
};
</script>
<style lang="scss" scoped>
.menuTree {
  .el-container {
    .el-header {
      height: px2rem(60) !important;
      line-height: px2rem(60);
      margin-left: px2rem(10);
      background: $bgColor;
      padding: 0 px2rem(10);
      box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.1);
      .el-col {
        padding: px2rem(1);
        i {
          width: px2rem(4);
          height: px2rem(18);
          margin: px2rem(-2) px2rem(10);
          display: inline-block;
        }
        .self-title {
          color: $selfTitle;
          font-size: px2rem(18);
        }
        /deep/ .el-input__inner {
          height: px2rem(34);
          line-height: px2rem(34);
          font-size: px2rem(13);
        }
        /deep/ .el-icon-time:before {
          color: $btn;
        }
      }
    }
    .el-main {
      height: 86vh;
      position: relative;
      background: $bgColor;
      margin: px2rem(10);
      padding: 0 px2rem(10);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
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
          width: 20%;
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
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
