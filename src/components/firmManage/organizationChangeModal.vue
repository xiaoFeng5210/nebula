<template>
  <el-dialog title="新增组织" :visible="dialogVisible" width="27%" :show-close="false">
    <!--      表单-->
    <el-form ref="staffForm" :model="deptPojo" label-position="right" label-width="110px">
      <el-form-item label="上级部门：" v-if="deptNameDisabled">
        <el-input v-model="deptPojo.parentDeptName" size="small" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="组织名称：">
        <el-input v-model="deptPojo.deptName" size="small"></el-input>
      </el-form-item>
      <el-form-item label="组织描述：" v-if="deptNameDisabled">
        <el-input v-model="deptPojo.deptDesc" size="small"></el-input>
      </el-form-item>
      <el-form-item label="组织显示顺序：" v-if="deptNameDisabled">
        <el-input-number
          v-model="deptPojo.displayOrder"
          controls-position="right"
          @change="handleChange"
          :min="1"
          :max="20"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { deptSave, deptUsavetreeItempdate } from '../../api/dept';

export default {
  name: 'organizationChangeModal',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    deptNameDisabled: {
      type: Boolean,
      default: true,
    },
    deptPojo: {
      companyId: localStorage.getItem('companyId'),
      deptDesc: null,
      deptName: null,
      displayOrder: 0,
      deptType: 1,
      id: null,
      parentId: null,
      parentDeptName: null,
    },
  },
  methods: {
    handleCancel() {
      this.$emit('close-modal');
    },
    handleConfirm() {
      const t = this;
      if (t.deptPojo.id === null || t.deptPojo.id === '') {
        t.addDeptPojo();
      } else {
        t.updateDeptPojo();
      }
    },
    addDeptPojo() {
      const t = this;
      deptSave(t.deptPojo).then((res) => {
        if (res.code === 200 && res.data) {
          t.$message.success('组织添加成功');
          t.$emit('close-modal');
        }
      });
    },
    updateDeptPojo() {
      const t = this;
      deptUpdate(t.deptPojo).then((res) => {
        if (res.code === 200 && res.data) {
          t.$message.success('组织修改成功');
          t.$emit('close-modal');
        }
      });
    },
    handleChange(value) {
      this.$emit('number-change', value);
    },
  },
};
</script>

<style scoped>
</style>
