<template>
  <div class="resource">
    <el-container>
      <el-header class="bg-white d-flex jc-between ai-center">
        <div class="top-left">
          <i class="bg-primary"></i>
          资源管理
        </div>
        <div>
          <el-select v-model="status" placeholder="全部" @change="handleChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="transformBtn">重新转换</el-button>
          <el-button type="danger" plain size="mini" class="deleteBtn" @click="deleteBtn">删除</el-button>
        </div>
      </el-header>
      <el-main>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="onTableSelect"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="oldFileName" label="名称"></el-table-column>
          <el-table-column prop="createTime" label="上传时间"></el-table-column>
          <el-table-column prop="updateUserName" label="上传人"></el-table-column>
          <el-table-column label="使用状态">
            <template slot-scope="scope">
              <span class="text-res" v-if="scope.row.fileStatus===-1">上传失败</span>
              <span class="text-primary" v-if="scope.row.fileStatus===0">上传中</span>
              <span class="text-primary" v-if="scope.row.fileStatus===1">已上传</span>
              <span class="text-grey" v-if="scope.row.fileStatus===2">未转换</span>
              <span class="text-deter" v-if="scope.row.fileStatus===3">转换中</span>
              <span class="text-suce" v-if="scope.row.fileStatus===4">已完成</span>
              <span class="text-res" v-if="scope.row.fileStatus===5">转换失败</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="transformEach(scope.row.projectId)">重新转换</el-button>
              <el-button type="danger" size="mini" @click="deleteEach(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totals"
          @current-change="currentChange"
          :page-size="size"
          :current-page="pages"
        ></el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  uploadLists,
  convertProject,
  delByIdFile
} from '../../api/proApi/aboutengin';
export default {
  name: 'selfCenter',
  data() {
    return {
      pages: 1, // 页码
      size: 10, // 每页大小
      totals: 0, // 总条数
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '-1',
          label: '上传失败'
        },
        {
          value: '0',
          label: '上传中'
        },
        {
          value: '1',
          label: '已上传'
        },
        {
          value: '2',
          label: '未转换'
        },
        {
          value: '3',
          label: '转换中'
        },
        {
          value: '4',
          label: '已完成'
        },
        {
          value: '5',
          label: '转换失败'
        }
      ],
      status: '',
      tableData: [],
      idslist: ''
    };
  },
  mounted() {
    this.getuplods();
  },
  methods: {
    getuplods() {
      const _this = this;
      const datas = {
        page: this.pages,
        size: 10,
        fileStatus: parseInt(this.status),
        projectId: localStorage.getItem('projectId')
      };
      uploadLists(datas).then(res => {
        if (res.code === 200 && res.data) {
          _this.tableData = res.data.list;
          _this.totals = res.data.total;
        }
      });
    },
    handleChange() {
      console.log(this.status);
      this.getuplods();
    },
    onTableSelect(rows) {
      this.idslist = '';
      rows.forEach(a => {
        this.idslist += a.id + ',';
      });
    },
    transformBtn() {
      convertProject(this.idslist).then(res => {
        if (res.code === 200) {
          this.getuplods();
        }
      });
    },
    deleteBtn() {
      delByIdFile(this.idslist).then(res => {
        if (res.code === 200) {
          this.getuplods();
        }
      });
    },
    currentChange() {
      this.pages++;
      this.getuplods();
    },
    transformEach(ids) {
      convertProject(ids).then(res => {
        if (res.code === 200) {
          this.getuplods();
        }
      });
    },
    deleteEach(ids) {
      delByIdFile(ids).then(res => {
        if (res.code === 200) {
          this.getuplods();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.resource {
  .el-container {
    .el-header {
      height: px2rem(60) !important;
      line-height: px2rem(60);
      margin-left: px2rem(10);
      padding: 0 px2rem(10);
      box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.1);
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
      /deep/ .el-input__inner {
        width: px2rem(110);
        height: px2rem(40);
        padding-right: px2rem(15);
        margin-right: px2rem(10);
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
      /deep/.el-table th {
        text-align: center;
      }
      /deep/.el-table td {
        text-align: center;
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
