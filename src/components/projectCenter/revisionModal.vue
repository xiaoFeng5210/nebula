<template>
  <div class="g-box">
    <el-dialog
      title="修改组织"
      :visible="dialogVisible"
      width="27%"
      :show-close="false"
    >
      <!--      组织树-->
      <el-tree
        class="filter-tree"
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'revisionOrganization',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeData: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 2,
              label: '二级 1-1',
              children: [
                {
                  id: 3,
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    handleConfirm() {
      this.$emit('close-modal');
    },
    handleCancel() {
      this.$emit('close-modal');
    }
  }
};
</script>

<style scoped lang="scss">
</style>
