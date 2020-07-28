<template>
  <el-dialog title="解除绑定" :visible="dialogVisible" width="27%" :show-close="false">
    <div>解除绑定后将无法使用该账号登录</div>

    <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getToken
} from '@/utils/auth';
import request from '@/utils/request';

export default {
  name: 'unBindModal',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCancel() {
      this.$emit('close-modal');
    },
    handleConfirm() {
      const data = {
        token: getToken('token')
      };
      request.post('api/bjbasicdata/deleteWeChat', data).then(res => {
        if (res.code === 200) {
          this.$message.success('解绑成功');
        } else {
          this.$message.error(res.message);
        }
      });
      this.$emit('close-modal');
    }
  }
};
</script>

<style scoped>
</style>
