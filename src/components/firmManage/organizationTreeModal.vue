<template>
  <el-dialog title="请选择组织" :visible="treeVisible" width="27%" :show-close="false">
    <el-tree
      class="filter-tree"
      ref="tree"
      :data="deptPojoList"
      node-key="id"
      default-expand-all
      :props="defaultProps"
      :expand-on-click-node="false"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <el-row>
          <el-col :span="24" @click.native="treeClick(node,data)">{{data.deptName}}</el-col>
        </el-row>
      </span>
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'organizationTreeModal',
  props: {
    treeVisible: {
      type: Boolean,
      default: false,
    },
    deptPojoList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      defaultProps: {
        children: 'nodes',
        label: 'deptName',
      },
      treeData: {
        catalog: '',
        parentId: null,
        parentDeptName: null,
      },
      treeClickData: {
        node: null,
        data: null,
      },
    };
  },
  methods: {
    handleCancel() {
      this.$emit('close-modal', this.treeData);
    },
    treeClick(node, data) {
      this.treeClickData.node = node;
      this.treeClickData.data = data;
    },
    getParent(node) {
      // 判断当前节点是否有父节点，并且父节点上的data不能是数组
      if (node.parent && !Array.isArray(node.parent.data)) {
        // 将父节点上data的menuid存储在 `parentlist` 里
        if (node.parent.data instanceof Object) {
          this.treeData.catalog =
            node.parent.data.deptName + '/' + this.treeData.catalog;
        }
        // 递归调用 父节点上有父节点
        this.getParent(node.parent);
        // 当父节点上data是数组时点击对象为当前tree最高目录 并且parentList必须是0
      }
    },
    handleConfirm() {
      const t = this;
      if (t.treeClickData.node != null) {
        t.treeData.catalog = '';
        t.getParent(t.treeClickData.node);
      }
      if (t.treeClickData.data != null) {
        t.treeData.catalog = t.treeData.catalog + t.treeClickData.data.deptName;
        t.treeData.parentId = t.treeClickData.data.parentId;
        t.treeData.parentDeptName = t.treeClickData.data.deptName;
      }
      this.$emit('close-modal', t.treeData);
    },
  },
};
</script>

<style scoped>
</style>
