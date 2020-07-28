<template>
  <div class="g__box">
    <div class="setHeader bg-white d-flex jc-between ai-center">
      <div class="lefts d-flex jc-between ai-center">
        <div class="line"></div>
        <div class="titles">项目人员</div>
      </div>
      <div class="rights bg-white d-flex jc-between ai-center">
        <el-button type="primary">全部展开/收起</el-button>
        <el-input placeholder="请输入内容" size="small" class="el-icon-search"></el-input>
      </div>
    </div>
    <div class="tables bg-white">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        default-expand-all
        row-key="id"
        v-loading="loading"
        :tree-props="{children: 'nodes', hasChildren: 'hasNodes'}"
      >
        <el-table-column prop="deptName" label="组织名称"></el-table-column>
        <el-table-column prop="createTime" label="创建日期"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="primary" v-if="row.parentId != -1" @click="handleAdd(row)">新增</el-button>
            <el-button type="primary" v-if="row.parentId != -1" @click="handleUpdate(row)">编辑</el-button>
            <el-button
              type="danger"
              plain
              class="el-icon-delete"
              v-if="row.parentId != -1"
              @click="deleteUpdate(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <organization-change-modal
      v-if="isChangeModalVisible"
      :dialogVisible="isChangeModalVisible"
      :deptPojo="deptPojo"
      @close-modal="handleCloseModal"
      @number-change="numberChange"
    />
  </div>
</template>
<script>
import { deptGetAllDept, deptFindById, deptDelById } from '../../api/dept';
import OrganizationChangeodal from './organizationChangeModal';
export default {
  name: 'roleManage',
  components: {
    'organization-change-modal': OrganizationChangeodal
  },
  data() {
    return {
      isChangeModalVisible: false,
      // tableData里需要分别一级部门和二级部门
      tableData: [],
      queryData: {
        companyId: localStorage.getItem('companyId')
      },
      deptPojo: {
        companyId: localStorage.getItem('companyId'),
        deptDesc: null,
        deptName: null,
        displayOrder: 0,
        deptType: 1,
        id: null,
        parentId: null,
        parentDeptName: null
      },
      loading: true
    };
  },
  mounted() {
    this.getDeptGetAllDept();
  },
  methods: {
    getDeptGetAllDept() {
      const t = this;
      t.loading = true;
      deptGetAllDept(t.queryData).then(res => {
        if (res.code === 200 && res.data) {
          t.tableData = res.data;
          t.loading = false;
        }
      });
    },
    deleteUpdate(row) {
      const t = this;
      t.$confirm(
        '此操作将永久删除「' +
          row.deptName +
          '」组织,并此该组织下的人员将划归至未归属组织 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deptDelById({ id: row.id }).then(res => {
          if (res.code === 200 && res.data) {
            t.$message.success('删除成功');
            t.getDeptGetAllDept();
          }
        });
      });
    },
    handleAdd(row) {
      console.log(row);
      const t = this;

      t.deptPojo = {
        companyId: t.queryData.companyId,
        deptDesc: '',
        deptName: '',
        displayOrder: 0,
        deptType: 1,
        id: null,
        parentId: row.id,
        parentDeptName: row.deptName
      };
      this.isChangeModalVisible = true;
    },
    getParentDeptName(row) {
      const t = this;
      deptFindById({ id: row.parentId }).then(res => {
        if (res.code === 200 && res.data) {
          t.deptPojo.parentDeptName = res.data.deptName;
        }
      });
    },
    handleUpdate(row) {
      const t = this;
      t.deptPojo = {
        companyId: t.queryData.companyId,
        deptDesc: row.deptDesc,
        deptName: row.deptName,
        displayOrder: row.displayOrder,
        deptType: row.deptType,
        id: row.id,
        parentId: row.parentId,
        parentDeptName: t.getParentDeptName(row)
      };
      this.isChangeModalVisible = true;
    },
    handleCloseModal() {
      this.getDeptGetAllDept();
      this.isChangeModalVisible = false;
    },
    numberChange(value) {
      this.deptPojo.displayOrder = value;
    }
  }
};
</script>
<style lang="scss" scoped>
.g__box {
  width: 100%;
  height: 100%;
  .setHeader {
    padding: px2rem(10) px2rem(20);
    .lefts {
      .line {
        width: px2rem(3);
        height: px2rem(18);
        margin-right: px2rem(10);
        background: $font;
      }
      .titles {
        font-size: px2rem(18);
      }
    }
    .rights {
      .el-input {
        width: px2rem(200);
      }
      /deep/ .el-input__inner {
        width: px2rem(200);
        height: 40px;
        line-height: 40px;
        font-size: px2rem(12);
        padding: 0 px2rem(30);
        color: $inputplace !important;
      }
      .el-icon-search::before {
        position: absolute;
        top: px2rem(18);
        left: px2rem(5);
      }
      .el-button {
        margin-right: px2rem(20);
        padding: px2rem(10) px2rem(15);
      }
    }
  }
  .tables {
    min-height: 92%;
    margin-top: px2rem(10);
  }
}
</style>
