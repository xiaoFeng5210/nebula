<template>
  <div class="project">
    <div class="setHeader bg-white d-flex jc-between ai-center">
      <div class="lefts d-flex jc-between ai-center">
        <div class="line"></div>
        <div class="titles">项目人员</div>
      </div>
      <div class="rights bg-white d-flex jc-between ai-center">
        <el-button type="primary" @click="agreement">同意通过</el-button>
        <el-button type="danger" @click="refuse">拒绝</el-button>
        <el-button class="dangers" plain type="danger" @click="deletes">删除</el-button>
        <el-input placeholder="请输入内容" size="small" class="el-icon-search"></el-input>
      </div>
    </div>
    <div class="tables bg-white">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @select="onTableSelect"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="userName" label="用户名称" width="150"></el-table-column>
        <el-table-column prop="accountName" label="账户名称" width="150"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="150"></el-table-column>
        <el-table-column prop="inviter" label="邀请人" width="120"></el-table-column>
        <el-table-column prop="jurisdiction" label="角色权限" width="110"></el-table-column>
        <el-table-column prop="status" label="状态" width="150">
          <template slot-scope="scope">
            <span class="text-deter" v-if="scope.row.status === '0'">待审核</span>
            <span class="text-suce" v-if="scope.row.status === '1'">已同意</span>
            <span class="text-res" v-if="scope.row.status === '2'">已拒绝</span>
            <span class="text-grey" v-if="scope.row.status === '3'">已过期</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请日期"></el-table-column>
        <el-table-column prop="updateTime" label="审核日期"></el-table-column>
        <el-table-column prop="status">
          <template class="d-flex jc-between ai-center" slot-scope="scope"  v-if="scope.row.status === '0'">
            <el-button type="primary" size="mini" @click="agreement(scope.row.id)">同意通过</el-button>
            <el-button type="danger" size="mini" @click="refuse(scope.row.id)">拒绝</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110">
          <template slot-scope="scope">
            <el-button class="dangers" type="danger" @click="deletes(scope.row.id)" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="currentChange"
        :page-size="size"
        :current-page="pages"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  AuditUser,
  AgreeUser,
  RefuseUser,
  deleteUser
} from '@/api/proApi/project';
export default {
  name: 'projectSets',
  data() {
    return {
      tableData: [],
      pages: 1,
      size: 10,
      projectId: localStorage.getItem('projectId'),
      companyId: localStorage.getItem('companyId'),
      total: 10,
      deleId: ''
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      AuditUser({
        page: this.pages,
        size: this.size,
        projectId: this.projectId
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
        }
      });
    },
    onTableSelect(rows) {
      this.deleId = '';
      rows.forEach(j => {
        this.deleId = j.id;
      });
    },
    agreement(id) {
      if (id) {
        this.deleId = id;
      }
      AgreeUser({
        ids: this.deleId,
        projectId: this.projectId,
        companyId: this.companyId,
        roleId: -1,
        jobId: -1,
        deptId: -1,
        realName: ''
      }).then(res => {
        if (res.code === 200) {
          this.getUsers();
        }
      });
    },
    refuse(id) {
      if (id) {
        this.deleId = id;
      }
      RefuseUser(this.deleId).then(res => {
        if (res.code === 200) {
          this.getUsers();
        }
      });
    },
    deletes(id) {
      deleteUser(id).then(res => {
        if (res.code === 200) {
          this.getUsers();
        }
      });
    },
    currentChange() {
      this.pages++;
      this.getUsers();
    }
  }
};
</script>

<style lang="scss" scoped>
.project {
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
        left: px2rem(10);
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
    }
  }
  .tables {
    min-height: 92.4%;
    margin-top: px2rem(10);
    /deep/.el-table th {
      text-align: center;
    }
    /deep/.el-table td {
      text-align: center;
      .dangers {
        border-color: $btnbor;
        color: $btnhover;
        background: $btnbor;
      }
      .dangers:hover {
        color: $bgColor;
        border-color: $btnhover;
        background: $btnhover;
      }
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
</style>
