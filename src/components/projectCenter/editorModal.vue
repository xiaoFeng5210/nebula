<template>
  <div class="g-box">
    <el-dialog title="编辑人员" :visible="dialogVisible" width="27%" :show-close="false">
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

        <el-form-item label="角色名称：">
          <el-select v-model="staffForm.projectRole" placeholder="请选择" size="small">
            <el-option
              v-for="item in roleNameList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="岗位名称：">
          <el-select v-model="staffForm.jobName" placeholder="请选择" size="small">
            <el-option
              v-for="item in jobNameList"
              :key="item.id"
              :label="item.jobName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属组织：">
          <span style="margin-right: 20px">{{staffForm.deptName}}</span>
          <el-button type="text" @click="handleReviseOrganize">修改</el-button>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <RevisionOrganization
      v-if="isRevisionModalVisible"
      :dialogVisible="isRevisionModalVisible"
      @close-modal="handleCloseModal"
    />
  </div>
</template>

<script>
import RevisionOrganization from './revisionModal';
import {
  getCompanyAllRole,
  getProjectName,
  EditUser
} from '@/api/proApi/project';
export default {
  name: 'editorStaffModal',
  components: {
    RevisionOrganization
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    rows: String,
    projectId: String
  },
  data() {
    return {
      isRevisionModalVisible: false,
      //  表单数据
      staffForm: JSON.parse(this.$props.rows),
      roleNameList: [],
      jobNameList: []
    };
  },
  mounted() {
    this.getobtain();
  },
  methods: {
    getobtain() {
      // 公司所有的角色  公司Id
      getCompanyAllRole(localStorage.getItem('companyId')).then(res => {
        if (res.code === 200) {
          this.roleNameList = res.data;
        }
      });
      // 项目Id
      getProjectName('9e028f55b35a265465b531adc35132d0').then(res => {
        if (res.code === 200) {
          this.jobNameList = res.data;
        }
      });
    },
    // 修改组织
    handleReviseOrganize() {
      this.isRevisionModalVisible = true;
    },
    handleConfirm() {
      const datas = {
        roleId: this.staffForm.id,
        jobId: this.staffForm.jobId,
        deptId: '-1',
        realName: this.staffForm.realName,
        userId: this.staffForm.userId,
        projectId: this.$props.projectId,
        companyId: this.staffForm.companyId
      };
      EditUser(datas).then(res => {
        if (res.code === 200) {
          this.$emit('closemodal', 'success');
        }
      });
    },
    handleCancel() {
      this.$emit('closemodal');
    },
    // 关闭编辑框
    handleCloseModal() {
      this.isRevisionModalVisible = false;
    }
  }
};
</script>

<style scoped lang="scss">
.g-box {
  /deep/ .el-input__inner {
    width: 300px;
  }
}
</style>
