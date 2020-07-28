<template>
  <div class="main">
    <div class="setHeader bg-white d-flex jc-between ai-center">
      <div class="lefts d-flex jc-between ai-center">
        <div class="line"></div>
        <div class="titles">项目人员</div>
      </div>
      <div class="rights bg-white d-flex jc-between ai-center">
        <el-button type="primary" @click="showDialog('add')">添加</el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="岗位名称" name="first">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" width="120">
            <template slot-scope="scope">{{ scope.$index }}</template>
          </el-table-column>
          <el-table-column prop="jobName" label="岗位" width="120"></el-table-column>
          <el-table-column label="操作" width="160px">
            <template slot-scope="scope">
              <el-button size="mini" @click="showDialog('edit',scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="批注标签" name="second">
        <el-table
          ref="multipleTable"
          :data="datas"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" width="120">
            <template slot-scope="scope">{{ scope.$index }}</template>
          </el-table-column>
          <el-table-column prop="dictLabel" label="批注标签" width="120"></el-table-column>
          <el-table-column prop="dictValue" label="批注值" width="120"></el-table-column>
          <el-table-column prop="remark" label="备注" width="120"></el-table-column>
          <el-table-column label="操作" width="160px">
            <template slot-scope="scope">
              <el-button size="mini" @click="showDialog('edit',scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="资料标签" name="third">
        <el-table
          ref="multipleTable"
          :data="datas"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" width="120">
            <template slot-scope="scope">{{ scope.$index }}</template>
          </el-table-column>
          <el-table-column prop="dictLabel" label="资料标签" width="120"></el-table-column>
          <el-table-column prop="dictValue" label="资料值" width="120"></el-table-column>
          <el-table-column prop="remark" label="备注" width="120"></el-table-column>
          <el-table-column label="操作" width="160px">
            <template slot-scope="scope">
              <el-button size="mini" @click="showDialog('edit',scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-pagination
      layout="prev, pager, next"
      :total="totalPage"
      style="text-align:center">
    </el-pagination>-->
    <el-dialog :title="diaTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="form" v-if="activeName === 'first'">
        <el-form-item label="岗位名称" :label-width="formLabelWidth">
          <el-input v-model="form.jobName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- dicform -->
      <el-form :model="dicform" v-else>
        <el-form-item label="字典名称" :label-width="formLabelWidth">
          <el-input v-model="dicform.dictLabel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典值" :label-width="formLabelWidth">
          <el-input v-model="dicform.dictValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="dicform.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllByProjectId,
  sysJobSave,
  sysJobUpdate,
  sysJobDelById,
  getAllByProjectlist
} from '../../api/proApi/sysjob';
import {
  sysDictList,
  sysDictsave,
  sysDictupdate,
  sysDictDelete
} from '../../api/proApi/sysDict';
import { Switch } from 'element-ui';
export default {
  name: '',
  data() {
    return {
      activeName: 'first',
      tableData: [],
      multipleSelection: [],
      dialogFormVisible: false,
      form: {
        page: 1,
        size: 10,
        projectId: localStorage.getItem('projectId'),
        jobType: 0,
        jobName: ''
      },
      dicform: {
        dictCode: '',
        dictLabel: '',
        dictValue: '',
        dictType: '',
        parentId: '',
        remark: '',
        projectId: localStorage.getItem('projectId')
      },
      formLabelWidth: '120px',
      diaTitle: '新增岗位名称',
      datas: [],
      dicParams: {
        dictType: '2',
        dictCode: '', // data_label资料，annotation_tag
        projectId: localStorage.getItem('projectId'),
        page: 1,
        size: 10
      }
    };
  },
  watch: {
    activeName: function(val) {
      switch (val) {
      case 'first': // 岗位名称接口
        break;
      case 'second':
        this.dicParams.dictCode = 'annotation_tag';
        this.dicParams.projectId = localStorage.getItem('projectId');
        this.dicList();
        break;
      case 'third': // 资料标签接口
        this.dicParams.dictCode = 'data_label';
        this.dicParams.projectId = localStorage.getItem('projectId');
        this.dicList();
        break;
      default:
        break;
      }
    }
  },
  mounted() {
    this.form.projectId = localStorage.getItem('projectId');
    this.jobList();
  },
  methods: {
    jobList() {
      getAllByProjectId(this.form.projectId).then(res => {
        if (res.code === 200) {
          this.tableData = res.data;
        }
      });
      // getAllByProjectlist(this.form).then(res => {
      //   if (res.code === 200) {
      //     this.tableData = res.data;
      //   }
      // })
    },
    dicList() {
      if (this.activeName === 'second') {
        this.dicParams.dictCode = 'annotation_tag';
      } else if (this.activeName === 'third') {
        this.dicParams.dictCode = 'data_label';
      }
      sysDictList(this.dicParams).then(res => {
        if (res.code === 200) {
          this.datas = res.data.list;
        }
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    submit() {
      switch (this.diaTitle) {
      case '新增岗位名称':
        this.handleSave();
        break;
      case '编辑岗位名称':
        this.handleUpdate();
        break;
      case '新增批注标签':
        this.dicSave();
        break;
      case '编辑批注标签':
        this.dicUpdate();
        break;
      case '新增资料标签':
        this.dicSave();
        break;
      case '编辑资料标签':
        this.dicUpdate();
        break;
      default:
        break;
      }
    },
    dicSave() {
      if (this.activeName === 'second') {
        this.dicform.dictCode = 'annotation_tag';
      } else if (this.activeName === 'third') {
        this.dicform.dictCode = 'data_label';
      }
      sysDictsave(this.dicform).then(res => {
        if (res.code === 200) {
          this.$message.success('添加成功');
          this.dialogFormVisible = false;
          this.dicList();
        }
      });
    },
    dicUpdate() {
      sysDictupdate(this.dicform).then(res => {
        if (res.code === 200) {
          this.$message.success('编辑成功');
          this.dialogFormVisible = false;
          this.dicList();
        }
      });
    },
    handleSave() {
      sysJobSave(this.form).then(res => {
        if (res.code === 200) {
          this.$message.success('添加成功');
          this.dialogFormVisible = false;
          this.jobList();
        }
      });
    },
    handleUpdate() {
      sysJobUpdate(this.form).then(res => {
        if (res.code === 200) {
          this.$message.success('更新成功');
          this.dialogFormVisible = false;
          this.jobList();
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.activeName === 'first') {
          sysJobDelById(row.id).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功');
              this.jobList();
            }
          });
        } else {
          sysDictDelete(row.id).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功');
              this.dicList();
            }
          });
        }
      });
    },
    showDialog(type, row) {
      if (type === 'add') {
        // 新增
        this.form = {};
        this.form.projectId = localStorage.getItem('projectId'); // dicform
        this.dicform = {};
        this.dicform.projectId = localStorage.getItem('projectId');
        this.dicform.dictType = '2';
        this.dialogFormVisible = true;
        if (this.activeName === 'first') {
          this.diaTitle = '新增岗位名称';
        } else if (this.activeName === 'second') {
          this.dicform.dictCode = 'annotation_tag';
          this.diaTitle = '新增批注标签';
        } else {
          this.dicform.dictCode = 'data_label';
          this.diaTitle = '新增资料标签';
        }
      } else {
        // 编辑
        this.dialogFormVisible = true;
        this.form = row;
        this.dicform = row;
        if (this.activeName === 'first') {
          this.diaTitle = '编辑岗位名称';
        } else if (this.activeName === 'second') {
          this.diaTitle = '编辑批注标签';
        } else {
          this.diaTitle = '编辑资料标签';
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  padding: px2rem(10);
  box-sizing: border-box;
  background-color: $bgColor;
  .setHeader {
    padding-bottom: px2rem(20);
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
}
</style>
