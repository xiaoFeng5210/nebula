<template>
  <div class="project">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="projectname" label="项目名称"></el-table-column>
      <el-table-column prop="department" label="所属企业"></el-table-column>
      <el-table-column prop="post" label="岗位"></el-table-column>
      <el-table-column prop="organization" label="所在组织"></el-table-column>
      <el-table-column prop="participation" label="参与程度">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.participation === '被邀请的' ? 'primary' : 'success'"
            disable-transitions
          >{{scope.row.participation}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="addtime" label="加入时间"></el-table-column>
      <el-table-column label="操作">
        <el-row>
          <el-col :span="12">
            <el-button type="primary">退出</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="danger">删除</el-button>
          </el-col>
        </el-row>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          projectname: '上海中心',
          department: '秉匠科技',
          post: '技术人员',
          organization: '上海分公司',
          participation: '被邀请的',
          addtime: '2020-05-10'
        },
        {
          projectname: '上海中心',
          department: '秉匠科技',
          post: '技术人员',
          organization: '上海分公司',
          participation: '我创建的',
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
  /deep/.el-table th {
    text-align: center;
  }
  /deep/.el-table td {
    text-align: center;
  }
}
</style>
