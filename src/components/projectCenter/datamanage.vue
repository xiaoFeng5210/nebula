<template>
  <div class="project">
    <div class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="projectname" label="用户名称"></el-table-column>
        <el-table-column prop="department" label="真实姓名"></el-table-column>
        <el-table-column prop="post" label="手机号"></el-table-column>
        <el-table-column prop="organization" label="邮箱"></el-table-column>
        <el-table-column prop="participation" label="角色名称"></el-table-column>
        <el-table-column prop="addtime" label="岗位名称"></el-table-column>
        <el-table-column prop="addtime" label="加入日期"></el-table-column>
        <el-table-column label="操作">
          <el-button type="danger">删除</el-button>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  props: { title: String },
  data() {
    return {
      tableData: [
        {
          projectname: '上海中心',
          department: '秉匠科技',
          post: '技术人员',
          organization: '上海分公司',
          participation: '被邀请的',
          postName: '被邀请的',
          addtime: '2020-05-10'
        },
        {
          projectname: '上海中心',
          department: '秉匠科技',
          post: '技术人员',
          organization: '上海分公司',
          participation: '我创建的',
          postName: '被邀请的',
          addtime: '2020-05-10'
        },
        {
          projectname: '上海中心',
          department: '秉匠科技',
          post: '技术人员',
          organization: '上海分公司',
          participation: '0',
          addtime: '2020-05-10'
        },
        {
          projectname: '上海中心',
          department: '秉匠科技',
          post: '技术人员',
          organization: '上海分公司',
          participation: '0',
          addtime: '2020-05-10'
        },
        {
          projectname: '上海中心',
          department: '秉匠科技',
          post: '技术人员',
          organization: '上海分公司',
          participation: '0',
          addtime: '2020-05-10'
        },
        {
          projectname: '上海中心',
          department: '秉匠科技',
          post: '技术人员',
          organization: '上海分公司',
          participation: '0',
          addtime: '2020-05-10'
        },
        {
          projectname: '上海中心',
          department: '秉匠科技',
          post: '技术人员',
          organization: '上海分公司',
          participation: '0',
          addtime: '2020-05-10'
        }
      ]
    };
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.project {
  width: 100%;
  height: 100%;
  padding: px2rem(10);
  box-sizing: border-box;
  background-color: $bgColor;
  .table {
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
  }
}
</style>
