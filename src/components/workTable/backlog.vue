<template>
  <div class="backlog">
    <el-container>
      <el-header class="bg-white">
        <el-row>
          <el-col :span="4" class="self-title">
            <i class="bg-primary"></i>
            待办事项
          </el-col>
          <el-col :span="14"></el-col>
          <el-col :span="2">
            <el-select v-model="value" placeholder="全部" @change="handleChange">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="2" class="text-center">
            <el-button type="primary" size="mini" @click="ignoreAllBtn">全部忽略</el-button>
          </el-col>
          <el-col :span="1" class="text-center">
            <el-button size="mini" class="ignoreBtn" @click="selectedIgnore">忽略</el-button>
          </el-col>
          <el-col :span="1" class="text-center">
            <el-button size="mini" class="deleteBtn" @click="filterBtn">删除</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-table
          ref="multipleTable"
          :data="backlogData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelected"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号" width="180" align="left"></el-table-column>
          <el-table-column prop="typeName" label="类型"></el-table-column>
          <el-table-column prop="contentList" label="内容" width="400" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column prop="createUserName" label="相关人员"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="checkBtn(scope.row)" type="primary" size="small">查看</el-button>
              <el-button type="danger" size="mini" @click="ignoreBtn(scope.row.id)">忽略</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="currentChange"
          :page-size="backlogParams.size"
          :current-page="backlogParams.page"
        ></el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { updateStatus, listByType } from '@/api/workTable';
export default {
  name: 'backlog',
  data() {
    return {
      backlogData: [],
      allIds: [], // 所有要更新的id 列表
      ids: [], // 选中要更新的id 列表
      total: 0, // 总条数
      // 获取待办事项列表参数
      backlogParams: {
        page: 1, // 页码
        size: 10, // 每页大小
        place: 1, // 工作台
        projectId: '', // 项目id
        type: 1, // 类型:1待办事项
        day: '' // 最近几天
      },
      options: [
        {
          value: '选项1',
          label: '最近7天'
        },
        {
          value: '选项2',
          label: '最近30天'
        },
        {
          value: '选项3',
          label: '自定义'
        }
      ],
      value: '' // 搜索选中的值
    };
  },
  methods: {
    // 分页导航
    currentChange(val) {
      this.backlogParams.page = val;
      this.getBacklogList();
    },
    // 全部忽略
    ignoreAllBtn() {
      const updataParams = {
        type: 1,
        status: 3,
        ids: this.allIds
      };
      updateStatus(updataParams).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.getBacklogList();
        }
      });
    },
    // 批量忽略
    selectedIgnore() {
      const updataParams = {
        type: 1,
        status: 3,
        ids: this.ids
      };
      if (this.ids.length === 0 || this.ids === '' || this.ids === null) {
        this.$message({
          showClose: true,
          message: '您还未选择任何代办事项',
          type: 'warning'
        });
      } else {
        updateStatus(updataParams).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.getBacklogList();
          }
        });
      }
    },
    // 忽略
    ignoreBtn(id) {
      this.ids.push(id);
      const updataParams = {
        type: 1,
        status: 3,
        ids: this.ids
      };
      updateStatus(updataParams).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
        }
        this.getBacklogList();
      });
    },
    // 查看
    checkBtn(row) {
      this.$router.push({
        path: '/scene',
        query: {
          id: row.id
        }
      });
    },
    // 获取要更新的id 列表
    handleSelected(val) {
      this.ids = [];
      if (val) {
        val.forEach(item => {
          this.ids.push(item.id);
        });
      }
    },
    // 删除
    filterBtn() {
      const updataParams = {
        type: 1,
        status: 4,
        ids: this.ids
      };
      if (this.ids.length === 0 || this.ids === '' || this.ids === null) {
        this.$message({
          showClose: true,
          message: '您还未选择任何代办事项',
          type: 'warning'
        });
      } else {
        this.$confirm('您是否确定删除该项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatus(updataParams).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.getBacklogList();
            }
          });
        });
      }
    },
    // 搜索代办事项
    handleChange(val) {
      if (val.label === '自定义') {
        this.$prompt('请输入自定义查询天数', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]*[1-9][0-9]*$/,
          inputErrorMessage: '请输入查询数字'
        })
          .then(({ value }) => {
            this.value = value;
            this.backlogParams.day = value;
            this.getBacklogList();
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
            this.value = '全部';
          });
      } else if (val.label === '最近7天') {
        this.backlogParams.day = 7;
        this.getBacklogList();
      } else if (val.label === '最近30天') {
        this.backlogParams.day = 30;
        this.getBacklogList();
      }
    },
    // 获取待办事项列表
    getBacklogList() {
      listByType(this.backlogParams).then(res => {
        if (res.code === 200) {
          this.backlogData = res.data.list;
          this.total = res.data.total;
          this.backlogData.forEach(item => {
            this.allIds.push(item.id);
          });
        }
      });
    }
  },
  mounted() {
    this.getBacklogList();
  }
};
</script>

<style lang="scss" scoped>
.backlog {
  .el-container {
    .el-header {
      height: px2rem(60) !important;
      line-height: px2rem(60);
      margin-left: px2rem(10);
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
        .deleteBtn {
          color: $absColor;
        }
        .ignoreBtn {
          color: $font;
        }
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
    .el-main {
      height: 86vh;
      position: relative;
      background: #fff;
      margin: px2rem(10);
      padding: 0 px2rem(10);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
      .el-table /deep/ .cell {
        padding-right: px2rem(60);
      }
      .el-pagination {
        text-align: center;
        position: absolute;
        left: 50%;
        bottom: px2rem(20);
        transform: translateX(-50%);
      }
    }
  }
}
</style>
