<template>
  <div class="complete bg-white">
    <el-container>
      <el-header class="d-flex jc-between ai-center">
        <div>
          <el-button type="primary" plain class="el-icon-s-release" @click="handleDeleteRecycleList"
            >彻底删除</el-button
          >
          <el-button type="primary" plain class="el-icon-refresh" @click="handleRecoverRecycleList"
            >还原</el-button
          >
          <el-button type="danger" @click="handleCleanRecycleList">清空回收站</el-button>
        </div>
        <div class="d-flex jc-between ai-center">
          <div class="right-tag d-flex jc-between ai-center">
            <el-button class="el-icon-sort"></el-button>
            <el-button class="el-icon-menu"></el-button>
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="header d-flex jc-between ai-center">
          <div class="d-flex jc-between ai-center">
            <div class="tags">
              <router-link to="/complete">返回上一级</router-link>
            </div>
            <div class="lines"></div>
            <div class="tags text-primary">回收站</div>
          </div>
          <div>已全部加载，共6个</div>
        </div>
        <div class="table">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column
              prop="fileName"
              label="文件名"
              sortable
            ></el-table-column>
            <el-table-column
              prop="createUserName"
              label="创建人/上传人"
            ></el-table-column>
            <el-table-column
              prop="fileSize"
              label="大小"
              sortable
            ></el-table-column>
            <el-table-column
              prop="deleteTime"
              label="删除日期"
              sortable
            >
              <template slot-scope="scope">
                {{scope.row.deleteTime | formatCreateTime(scope.row.deleteTime)}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { getRecycleListClient, deleteRecycleFilesClient, recoverRecycleFilesClient} from '@/api/datumInterface';
export default {
  name: 'complete',
  data() {
    return {
      ids: [],
      // 查询参数
      tableQuery: {
        projectId: 'res_eddqbim', // 项目ID，暂时先写死
        parentId: '0'
      },
      tableData: [],
      multipleSelection: []
    };
  },
  created() {

  },
  mounted() {
    this.getRecycleList();
  },
  methods: {
    // 获取列表数据
    getRecycleList() {
      const data = { ...this.tableQuery };
      getRecycleListClient(data).then(res => {
        console.log('获取列表数据');
        if (res.code === 200) {
          this.tableData = res.data.list;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    // 彻底删除
    handleDeleteRecycleList() {
      console.log('彻底删除');
      console.log(this.multipleSelection);
      this.multipleSelection.forEach((v, i) => {
        this.ids[i] = v.id;
      });
      const data = {ids : this.ids };
      console.log(data);
      this.httpClientDeleteRecycle(data);
    },
    // 彻底删除接口
    httpClientDeleteRecycle(data) {
      deleteRecycleFilesClient(data).then(res => {
        if (res.data === true) {
          this.$message.success('彻底删除成功');
          this.getRecycleList();
        } else {
          return this.$message.error(res.message);
        }
      });
    },
    // 清空回收站
    handleCleanRecycleList() {
      console.log('清空回收站');
      console.log(this.tableData);
      this.tableData.forEach((v, i) => {
        this.ids[i] = v.id;
      });
      const data = {ids : this.ids };
      console.log(data);
      this.httpClientDeleteRecycle(data);
    },
    // 还原
    handleRecoverRecycleList() {
      console.log('还原');
      console.log(this.multipleSelection);
      this.multipleSelection.forEach((v, i) => {
        this.ids[i] = v.id;
      });
      const data = {ids : this.ids };
      console.log(data);
      this.httpClientRecoverRecycle(data);
    },
    // 还原接口
    httpClientRecoverRecycle(data) {
      recoverRecycleFilesClient(data).then(res => {
        if (res.data === true) {
          this.$message.success('还原成功');
          this.getRecycleList();
        } else {
          return this.$message.error(res.message);
        }
      });
    }
  },
  filters: {
    // 格式化时间yyyy-MM-dd HH:mm:ss -> yyyy-MM-dd
    formatCreateTime: function (val) {
      const str = val.trim().split(/\s+/);
      return str[0];
    }
  }
};
</script>

<style lang="scss" scoped>
.complete {
  position: relative;
  width: 100%;
  height: 100%;
  .el-header {
    border-bottom: px2rem(1) solid $bors;
    .el-button {
      padding: px2rem(10) px2rem(20);
    }
    .el-button::before {
      margin-right: px2rem(8);
    }
    .el-input {
      margin: 0 px2rem(10);
      padding: 0 px2rem(10);
      /deep/ .el-input__inner {
        height: px2rem(38);
        line-height: px2rem(38);
      }
    }
    .right-tag {
      width: px2rem(120);
      height: px2rem(34);
      line-height: px2rem(34);
      .el-button {
        width: px2rem(44);
        padding: px2rem(10) px2rem(15);
      }
    }
  }

  .el-main {
    padding: 0;
    .header {
      height: px2rem(60);
      line-height: px2rem(60);
      font-size: px2rem(13);
      color: $selfTitle;
      padding: 0 px2rem(20);
      border-bottom: px2rem(1) solid $bors;
      .tags {
        width: px2rem(80);
      }
      .lines {
        width: px2rem(1);
        height: px2rem(20);
        margin: 0 px2rem(10);
        background: $bors;
      }
      .line {
        width: px2rem(14);
        height: px2rem(1);
        margin: 0 px2rem(10);
        background: $bors;
      }
    }
    .table {
      padding: 0 px2rem(20);
    }
  }
}
</style>
