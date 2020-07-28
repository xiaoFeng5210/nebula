<template>
  <div class="personSet bg-white">
    <el-container>
      <el-aside class="bg-white">
        <asideTree
          @propstreeson="propsTreeson"
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
            <el-button type="primary" @click="inviteMember">邀请人员</el-button>
            <el-button type="primary" @click="userMoveDept">移动</el-button>
            <el-button class="dangers" plain type="danger" @click="deletes">删除</el-button>
            <el-input placeholder="请输入内容" size="small" class="el-icon-search"></el-input>
            <el-select v-model="value" slot="prepend" placeholder="请选择">
              <el-option label="组织" value="deptName"></el-option>
              <el-option label="岗位" value="jobName"></el-option>
              <el-option label="角色" value="projectRole"></el-option>
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
            @select="onTableSelect"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="userName" label="用户名称"></el-table-column>
            <el-table-column prop="realName" label="真实姓名"></el-table-column>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="projectRole" label="角色名称"></el-table-column>
            <el-table-column prop="jobName" label="岗位名称"></el-table-column>
            <el-table-column prop="updateTime" label="加入日期"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="action el-icon-edit" @click="handleEditor(scope.row)"></div>
                <div class="action el-icon-s-tools" @click="handleIntercalate(scope.row)"></div>
              </template>
            </el-table-column>
          </el-table>
          <editorModal
            v-if="redact"
            :projectId="projectId"
            :rows="rows"
            :dialogVisible="redact"
            @closemodal="closeModal"
          />
          <datumModal v-if="reSet" :rows="rows" :dialogVisible="reSet" @closemodal="closeAuthor" />
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="currentChange"
          :page-size="size"
          :current-page="pages"
        ></el-pagination>
        <el-dialog
          :title="inviteTit"
          v-model="inviteData"
          :close-on-click-modal="false"
          :visible.sync="dialogTableVisible"
        >
          <el-row style="padding: 0 40px; box-sizing:border-box">
            <div class="marginbtm">方式一：</div>
            <el-col :span="16" :offset="2" class="marginbtm">
              <el-input v-model="inviteData.url" disabled></el-input>
            </el-col>
            <el-col :span="5" :offset="1" class="marginbtm">
              <el-button
                type="primary"
                ref="copy"
                :data-clipboard-text="inviteData.url"
                @click="copy"
                id="copy_text"
              >复制链接</el-button>
            </el-col>
            <!-- <div>方式二：</div>
            <el-col :span="4" :offset="4">
              <img src="../../assets/code.jpg" alt="" srcset="" style="display:block;width:120px">
            </el-col>
            <el-col :span="10" :offset="1">
              <span>使用手机微信或者QQ扫码，右上角链接分享加入</span>
            </el-col>-->
            <el-col :span="24" class="marginbtm">
              <el-col :span="3">有效设置期：</el-col>
              <el-col :span="10">
                <el-radio-group v-model="inviteData.radio" @change="radioChange">
                  <el-radio :label="7">7天</el-radio>
                  <el-radio :label="30">30天</el-radio>
                </el-radio-group>
              </el-col>
            </el-col>
            <el-col :span="24" class="marginbtm">
              审核设置：
              <el-checkbox
                :checked="inviteData.isManage==='0'?true:false"
                label="需要管理员审核"
                @change="handleCheckbox"
              ></el-checkbox>
            </el-col>
          </el-row>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import editorModal from './editorModal';
import datumModal from './datumModal';
import asideTree from '@/components/projectCenter/asideTree';
import { getProuser, deleteUser, UserMoveDept } from '@/api/proApi/project';
import { sysInviteSave, findById } from '../../api/proApi/invite';
import Clipboard from 'clipboard';

export default {
  name: 'personSet',
  components: {
    editorModal,
    datumModal,
    asideTree
  },
  props: { title: String },
  data() {
    return {
      tableData: [],
      pages: 1,
      size: 10,
      projectId: localStorage.getItem('projectId'),
      total: 10,
      rows: '',
      redact: false,
      dialogTableVisible: false,
      inviteTit: '邀请成员加入组织：杨子的企业--昆阳路项目',
      checkList: ['7天'],
      inviteUrl: 'http://www.baidu.com',
      reSet: false,
      deleId: '',
      value: '',
      userParams: {
        page: 1,
        size: 10,
        projectId: localStorage.getItem('projectId'),
        deptId: ''
      },
      deptTreePojo: {
        deptTreeAction: 2,
        isTreeModalVisible: false
      },
      staffForm: {},
      multipleSelection: [],
      inviteParams: {
        projectId: localStorage.getItem('projectId'),
        companyId: localStorage.getItem('companyId'),
        projectName: localStorage.getItem('projectName'),
        expirationDateNum: '7',
        auditType: '0',
        companyName: '舜元建设（集团）有限公司'
      },
      inviteData: {
        radio: 7,
        isManage: '0',
        url: ''
      }
    };
  },
  mounted() {
    this.getProUser();
    this.inviteTit = '邀请成员加入组织：' + localStorage.getItem('projectName');
  },
  methods: {
    getProUser() {
      getProuser(this.userParams).then((res) => {
        if (res && res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    // 打开编辑框
    handleEditor(obj) {
      this.rows = JSON.stringify(obj);
      this.redact = true;
    },
    // 设置
    handleIntercalate(obj) {
      this.rows = JSON.stringify(obj);
      this.reSet = true;
    },
    // 关闭编辑框
    closeModal(vuls) {
      if (vuls === 'success') {
        this.getProUser();
      }
      this.redact = false;
    },
    closeAuthor() {
      this.reSet = false;
    },
    onTableSelect(rows) {
      this.deleId = '';
      rows.forEach((j) => {
        this.deleId = j.id + ',';
      });
    },
    treeHandleCloseModal(e) {
      console.log(e);
      const t = this;
      if (t.deptTreePojo.deptTreeAction === 2) {
        // 调用用户移动接口
        if (e.parentId != null && e.parentId !== '') {
          console.log(e, 'treehandle');
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
        userDeptIds: userDeptIds
      }).then((res) => {
        if (res.code === 200) {
          t.$message.success('操作成功');
          t.getProUser();
        }
      });
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
    currentChange() {
      this.pages++;
      this.getProUser();
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
    deletes() {
      deleteUser(this.deleId).then((res) => {
        if (res.code === 200) {
          this.getProUser();
        }
      });
    },
    propsTreeson(val) {
      if (val) {
        const datas = JSON.parse(val);
        this.userParams.deptId = datas.id;
        this.getProUser();
      }
    },
    // 邀请人员
    inviteMember() {
      this.inviteSave();
    },
    handleCheckbox(val) {
      if (val) {
        this.inviteParams.auditType = '0';
      } else {
        this.inviteParams.auditType = '1';
      }
      this.$nextTick(function () {
        this.inviteSave();
      });
    },
    radioChange(val) {
      if (val) {
        this.inviteParams.expirationDateNum = val;
        this.$nextTick(function () {
          this.inviteSave();
        });
      }
    },
    inviteSave() {
      sysInviteSave(this.inviteParams).then((res) => {
        if (res && res.code === 200) {
          findById(res.data).then((res) => {
            if (res.code === 200) {
              this.inviteData = {
                url: res.data.inviteLink,
                radio: Number(this.inviteParams.expirationDateNum),
                isManage: this.inviteParams.auditType
              };
              this.dialogTableVisible = true;
            } else {
              this.$message.error('邀请失败');
            }
          });
        }
      });
    },
    copy() {
      var _ = this;
      var clipboard = new Clipboard('#copy_text');
      clipboard.on('success', () => {
        _.$message.success('复制成功');
        clipboard.destory();
      });
      clipboard.on('error', () => {
        _.$message.error('该浏览器不支持自动复制');
        clipboard.destroy();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.personSet {
  width: 100%;
  height: 100%;
  .marginbtm {
    margin-bottom: 30px;
  }
  .el-container {
    .el-aside {
      width: px2rem(240) !important;
      height: calc(100vh - 4.1rem);
      padding: 0 px2rem(10);
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
