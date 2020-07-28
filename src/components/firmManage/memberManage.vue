<template>
  <div class="project">
    <el-container>
      <el-aside class="bg-white">
        <asideTree
          @query-click="asideQueryClick"
          :deptTreePojo="deptTreePojo"
          @close-modal="treeHandleCloseModal"
        ></asideTree>
      </el-aside>
      <el-main>
        <div class="setHeader bg-white d-flex jc-between ai-center">
          <div class="lefts d-flex jc-between ai-center">
            <div class="line"></div>
            <div class="titles">项目人员</div>
          </div>
          <div class="rights bg-white d-flex jc-between ai-center">
            <el-button type="primary" @click="userMoveDept">移动</el-button>
            <el-button type="primary" @click="fimeDelUsers">移出企业</el-button>
            <el-input
              placeholder="请输入内容"
              size="small"
              class="el-icon-search"
              v-model="inputValue"
              @keyup.enter.native="queryInput"
            ></el-input>
            <el-select v-model="value" slot="prepend" placeholder="请选择">
              <el-option label="组织" value="deptName"></el-option>
              <el-option label="真实姓名" value="realName"></el-option>
              <el-option label="用户名称" value="userName"></el-option>
              <el-option label="手机号" value="mobile"></el-option>
            </el-select>
          </div>
        </div>
        <div class="table bg-white">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="userName" label="用户名称" width="100"></el-table-column>
            <el-table-column prop="realName" label="真实姓名" width="100"></el-table-column>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column prop="mailbox" label="邮箱"></el-table-column>
            <el-table-column prop="deptName" label="所属企业组织"></el-table-column>
            <el-table-column prop="projectNum" label="项目个数" width="100"></el-table-column>
            <el-table-column prop="updateTime" label="加入日期"></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button type="primary" @click="edit(row)">编辑</el-button>
                <el-button type="danger" @click="del(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
    <div class="g-box">
      <el-dialog title="编辑人员" :visible="dialogEditVisible" width="27%" :show-close="false">
        <!--      表单-->
        <el-form ref="staffForm" :model="staffForm" label-position="right" label-width="110px">
          <el-form-item label="用户名称：">
            <span>{{staffForm.userName}}</span>
          </el-form-item>

          <el-form-item label="真实姓名：">
            <el-input v-model="staffForm.realName" size="small"></el-input>
          </el-form-item>

          <el-form-item label="手机号：">
            <span>{{staffForm.mobile}}</span>
          </el-form-item>

          <el-form-item label="邮箱：">
            <span>{{staffForm.email}}</span>
          </el-form-item>
          <el-form-item label="所属组织：">
            <span style="margin-right: 20px">{{staffForm.deptNameTo}}</span>
            <el-button type="text" @click="handleReviseOrganize">修改</el-button>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleOrganizeReviseConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getCompanyUserList,
  companyUserDelById,
  companyUserListEdit,
} from '../../api/companyApi/company';
import { UserMoveDept } from '../../api/proApi/project';
import asideTree from '@/components/firmManage/asideTree';
export default {
  props: { title: String },
  components: {
    asideTree,
  },
  data() {
    return {
      dialogEditVisible: false,
      staffForm: {},
      tableData: [],
      value: '',
      queryData: {
        companyId: localStorage.getItem('companyId'),
        page: 1,
        size: 10,
        deptId: null,
        deptName: null,
        realName: null,
        userName: null,
        mobile: null,
      },
      multipleSelection: [],
      deptTreePojo: {
        deptTreeAction: 2,
        isTreeModalVisible: false,
      },
      inputValue: null,
    };
  },
  mounted() {
    this.getCompanyUserList();
  },
  methods: {
    queryInput() {
      const t = this;
      if (
        t.value != null &&
        t.value !== '' &&
        t.inputValue != null &&
        t.inputValue !== ''
      ) {
        switch (t.value) {
          case 'deptName':
            t.queryData.deptName = t.inputValue;
            t.queryData.realName = null;
            t.queryData.userName = null;
            t.queryData.mobile = null;
            break;
          case 'realName':
            t.queryData.realName = t.inputValue;
            t.queryData.deptName = null;
            t.queryData.userName = null;
            t.queryData.mobile = null;
            break;
          case 'userName':
            t.queryData.userName = t.inputValue;
            t.queryData.deptName = null;
            t.queryData.realName = null;
            t.queryData.mobile = null;
            break;
          case 'mobile':
            t.queryData.mobile = t.inputValue;
            t.queryData.deptName = null;
            t.queryData.realName = null;
            t.queryData.userName = null;
            break;
          default:
            console.log(t.inputValue);
            break;
        }
        t.getCompanyUserList();
      }
    },
    // 用户编辑确认
    handleOrganizeReviseConfirm() {
      const t = this;
      companyUserListEdit({
        deptId: t.staffForm.deptId,
        userId: t.staffForm.userId,
        companyId: t.queryData.companyId,
      }).then((res) => {
        if (res.code === 200) {
          t.$message.success('操作成功');
          t.getCompanyUserList();
        }
      });
    },
    // 用户
    handleReviseOrganize() {
      const t = this;
      t.deptTreePojo.deptTreeAction = 3;
      t.deptTreePojo.isTreeModalVisible = true;
    },
    treeHandleCloseModal(e) {
      console.log(e);
      const t = this;
      if (t.deptTreePojo.deptTreeAction === 2) {
        // 调用用户移动接口
        if (e.parentId != null && e.parentId !== '') {
          t.postUserMoveDept(e.parentId);
        }
      } else {
        // 调用用户编辑接口
        if (e.parentId != null && e.parentId !== '') {
          t.staffForm.deptNameTo = e.catalog;
          t.staffForm.deptId = e.parentId;
        }
      }
      t.deptTreePojo.isTreeModalVisible = false;
    },
    postUserMoveDept(deptId) {
      const t = this;
      const userDeptIds = [];
      t.multipleSelection.forEach((e) => {
        if (e.userDeptId != null && e.userDeptId !== '') {
          userDeptIds.push(e.userDeptId);
        }
      });
      UserMoveDept({
        targetDeptId: deptId,
        userDeptIds: userDeptIds,
      }).then((res) => {
        if (res.code === 200) {
          t.$message.success('操作成功');
          t.getCompanyUserList();
        }
      });
    },
    asideQueryClick(id) {
      this.queryData.deptId = id;
      this.getCompanyUserList();
    },
    edit(row) {
      this.dialogEditVisible = true;
      this.staffForm = {
        userId: row.userId,
        userName: row.userName,
        mobile: row.mobile,
        email: row.email,
        deptNameTo: row.deptName,
        deptName: row.deptName,
        deptId: row.deptId,
      };
    },
    fimeDelUsers() {
      const t = this;
      if (t.multipleSelection == null || t.multipleSelection.length === 0) {
        t.$message.info('您还未选择需要移除的用户');
        return null;
      }
      const ids = [];
      t.multipleSelection.forEach((e) => {
        if (e.id != null && e.id !== '') {
          ids.push(e.id);
        }
      });
      t.companyUserDel({ ids: ids });
    },
    userMoveDept() {
      const t = this;
      if (t.multipleSelection == null || t.multipleSelection.length === 0) {
        t.$message.info('您还未选择需要移动的用户');
        return null;
      }
      t.deptTreePojo.deptTreeAction = 2;
      t.deptTreePojo.isTreeModalVisible = true;
    },
    del(row) {
      const t = this;
      t.$confirm(
        '此操作将永久删除「' + row.realName + '」, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        t.companyUserDel({ ids: [row.id] });
      });
    },
    companyUserDel(data) {
      const t = this;
      companyUserDelById(data).then((res) => {
        // console.log(res);
        if (res.code === 200) {
          t.$message.success('删除成功');
          t.getCompanyUserList();
        }
      });
    },
    getCompanyUserList() {
      const t = this;
      getCompanyUserList(t.queryData).then((res) => {
        console.log(res);
        if (res.code === 200 && res.data) {
          t.tableData = res.data.list;
          console.log(t.tableData);
        }
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.project {
  width: 100%;
  height: 100%;
  .el-container {
    .el-aside {
      width: px2rem(240) !important;
      height: calc(100vh - 4.1rem);
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
      padding: 0;
      padding-left: px2rem(10);
      background: #f1f1f1;
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
          .dangers {
            margin-right: px2rem(20);
          }
          .dangers:hover {
            border-color: $btnhover;
            background: $btnhover;
          }

          .el-button {
            padding: px2rem(10) px2rem(15);
          }
          /deep/ .el-select {
            width: px2rem(120);
            margin-left: px2rem(20);
            /deep/ .el-input__inner {
              width: 100%;
              padding-right: px2rem(20);
            }
          }
        }
      }
      .table {
        min-height: 92%;
        margin-top: px2rem(10);
        /deep/.el-table th {
          text-align: center;
        }
        /deep/.el-table td {
          text-align: center;
        }
        .el-button--danger {
          border-color: $btnbor;
          color: $btnhover;
          background: $btnbor;
          margin-right: px2rem(20);
        }
        .el-button--danger:hover {
          border-color: $btnhover;
          color: $bgColor;
          background: $btnhover;
        }
        .action {
          width: px2rem(30);
          cursor: pointer;
        }
      }
      .el-pagination {
        text-align: center;
        position: absolute;
        left: 55%;
        bottom: px2rem(20);
        transform: translateX(-55%);
      }
    }
  }
}
</style>
