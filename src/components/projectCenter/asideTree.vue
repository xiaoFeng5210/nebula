<template>
  <div class="asideTree bg-white">
    <div class="tops">
      <div>
        <i class="bg-primary"></i> 组织列表
        <i class="el-icon-circle-plus-outline iconStyle" @click="handleCreate"></i>
      </div>
    </div>
    <el-tree
      class="filter-tree"
      ref="tree"
      :data="dataArr"
      show-checkbox
      node-key="id"
      default-expand-all
      :props="defaultProps"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span @click="handleTreeSon(data)">{{data.deptName}}({{data.userNum}})</span>
        <span>
          <el-button
            type="text"
            @click="() => addDept(node, data)"
            class="el-icon-circle-plus-outline"
          ></el-button>
          <!--          <el-button type="text"  @click="() => remove(node, data)" class="el-icon-remove-outline"></el-button>-->
          <el-dropdown>
            <el-button type="text" class="el-icon-more"></el-button>
            <el-dropdown-menu>
              <el-dropdown-item @click.native="transferDept(node,data)">移动</el-dropdown-item>
              <el-dropdown-item @click.native="renameDept(data)">重命名</el-dropdown-item>
              <el-dropdown-item @click.native="delDept(node, data)">删除</el-dropdown-item>
              <el-dropdown-item>角色设置</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </span>
    </el-tree>
    <OrganizationChangeodal
      v-if="isChangeModalVisible"
      :dialogVisible="isChangeModalVisible"
      :deptPojo="deptPojo"
      :deptNameDisabled="deptNameDisabled"
      @close-modal="handleCloseModal"
      @number-change="numberChange"
    />
    <OrganizationTreedal
      v-if="deptTreePojo.isTreeModalVisible"
      :treeVisible="deptTreePojo.isTreeModalVisible"
      :deptPojoList="dataArr"
      @close-modal="treeHandleCloseModal"
    />
  </div>
</template>
<script>
import {
  deptGetAllDept,
  deptDelById,
  deptUpdate,
  deptSave,
} from '../../api/dept';
import OrganizationChangeodal from '../firmManage/organizationChangeModal';
import OrganizationTreedal from '../firmManage/organizationTreeModal';
export default {
  props: {
    deptTreePojo: {
      deptTreeAction: 1,
      isTreeModalVisible: false,
    },
  },
  data() {
    return {
      id: 3,
      filterText: '',
      dataArr: [],
      queryData: {
        projectId: localStorage.getItem('projectId')
      },
      isChangeModalVisible: false,
      defaultProps: {
        children: 'nodes',
        label: 'deptName',
      },
      deptPojo: {
        projectId: localStorage.getItem('projectId'),
        deptDesc: null,
        deptName: null,
        deptType: 1,
        displayOrder: 0,
        parentId: null,
        parentDeptName: null,
      },
      deptNameDisabled: true,
      transferDeptId: null,
    };
  },
  components: {
    OrganizationChangeodal,
    OrganizationTreedal,
  },
  mounted() {
    this.getdeptGetAllDeptList();
  },
  methods: {
    treeHandleCloseModal(e) {
      if (this.deptTreePojo.deptTreeAction === 1) {
        this.selectedDept(e);
      } else {
        this.$emit('close-modal', e);
      }
    },
    selectedDept(e) {
      const t = this;
      if (e.parentId != null && e.parentId !== '') {
        const dataPojo = {
          id: t.transferDeptId,
          parentId: e.parentId,
        };
        deptUpdate(dataPojo).then((res) => {
          if (res.code === 200) {
            t.$message.success('部门移动成功');
            t.getdeptGetAllDeptList();
          }
        });
      }
      t.deptTreePojo.isTreeModalVisible = false;
    },
    transferDept(data) {
      const t = this;
      t.deptTreeAction = 1;
      t.transferDeptId = data.id;
      t.deptTreePojo.isTreeModalVisible = true;
    },
    delDept(node, data) {
      const t = this;
      t.$confirm(
        '此操作将永久删除「' +
          data.deptName +
          '」组织,并此该组织下的人员将划归至未归属组织 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        deptDelById({ id: data.id }).then((res) => {
          if (res.code === 200 && res.data) {
            t.$message.success('删除成功');
            t.removeNodes(node, data);
          }
        });
      });
    },
    removeNodes(node, data) {
      const parent = node.parent;
      const children = parent.data.nodes || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
    addDept(node, data) {
      this.deptPojo = {
        projectId: localStorage.getItem('projectId'),
        deptDesc: '',
        deptName: '',
        displayOrder: 0,
        deptType: 1,
        parentId: data.id,
        parentDeptName: data.deptName,
      };
      this.deptNameDisabled = true;
      this.isChangeModalVisible = true;
    },
    renameDept(data) {
      const t = this;
      t.deptPojo = {
        projectId: localStorage.getItem('projectId'),
        deptDesc: data.deptDesc,
        deptName: data.deptName,
        displayOrder: data.displayOrder,
        deptType: data.deptType,
        id: data.id,
        parentId: data.parentId,
        parentDeptName: '',
      };
      t.isChangeModalVisible = true;
      t.deptNameDisabled = false;
    },
    handleCloseModal() {
      this.getdeptGetAllDeptList();
      this.isChangeModalVisible = false;
    },
    numberChange(value) {
      this.deptPojo.displayOrder = value;
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.nodes || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 创建组织
    handleCreate() {},
    getdeptGetAllDeptList() {
      deptGetAllDept(this.queryData).then((res) => {
        if (res.code === 200) {
          this.dataArr = res.data;
        }
      });
    },
    handleTreeSon(data) {
      this.$emit('propstreeson', JSON.stringify(data));
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.asideTree {
  .tops {
    margin-left: px2rem(10);
    margin-top: px2rem(24);
    padding: 0 px2rem(10);
    color: $selfTitle;
    font-size: px2rem(16);
    i {
      width: px2rem(3);
      height: px2rem(16);
      margin: 0 px2rem(5);
      display: inline-block;
    }
    .iconStyle {
      display: inline-block;
      float: right;
    }
    /deep/ .el-input__inner {
      height: px2rem(35);
      border-radius: px2rem(20);
      background: $elInput;
      font-size: px2rem(12);
      margin-top: px2rem(14);
      padding: px2rem(4) px2rem(20);
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
        margin-right: 5px;
      }
    }
  }
}
</style>
