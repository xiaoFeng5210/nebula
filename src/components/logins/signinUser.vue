<template>
  <div class="signUser">
    <el-form
      ref="signForm"
      :model="signForm"
      :rules="signRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <el-form-item prop="username">
        <el-input
          ref="username"
          placeholder="请设置用户名"
          v-model.trim="signForm.username"
          maxlength="16"
          name="username"
          type="text"
          @input="change($event)"
          clearable
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          ref="password"
          v-model.trim="signForm.password"
          type="password"
          placeholder="请设置登录密码"
          name="password"
          maxlength="20"
          @input="change($event)"
          @paste.native.capture.prevent="handlePaste"
          show-password
        />
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input
          ref="checkPass"
          type="password"
          v-model.trim="signForm.checkPass"
          placeholder="请再次输入密码"
          maxlength="20"
          name="checkPass"
          @input="change($event)"
          @paste.native.capture.prevent="handlePaste"
          show-password
        />
      </el-form-item>
      <div class="opt fs-xs d-flex js-start ai-center">
        <div>
          <el-checkbox v-model="checkeds">我已阅读并同意</el-checkbox>
        </div>
        <div>
          <router-link target="_blank" :to="{path:'/agreement'}">《用户协议》</router-link>
        </div>
      </div>
      <el-button
        class="sign"
        :loading="loading"
        type="primary"
        @click.native.prevent="handleSign"
      >注册</el-button>
    </el-form>
  </div>
</template>
<script>
import aes from '@/utils/aes';
export default {
  name: 'signUser',
  props: {
    code: String,
    phone: String
  },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请再次输入密码'));
      } else if (value !== this.signForm.password) {
        return callback(new Error('两次输入密码不一致!'));
      } else {
        return callback();
      }
    };
    return {
      signForm: {
        username: '',
        password: '',
        checkPass: ''
      },
      signRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 16, message: '用户名4-16个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 20, message: '密码8-20个字符', trigger: 'blur' },
          {
            pattern: /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9](?=.*[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、*?]){8,20}.*/,
            message:
              '最少8位，包括至少1个大写字母，1个小写字母，1个数字,1个特殊字符'
          }
        ],
        checkPass: [
          {
            required: true,
            validator: validatePass2,
            trigger: 'blur'
          }
        ]
      },
      checkeds: false,
      loading: false
    };
  },
  methods: {
    handleSign() {
      const self = this;
      self.$refs.signForm.validate(valid => {
        if (valid) {
          const datas = {
            userName: self.signForm.username,
            passWord: aes.encrypt(self.signForm.password),
            checkCode: self.$props.code,
            mobile: self.$props.phone
          };
          if (self.checkeds === false) {
            self.$message.error('请阅读并接受用户协议');
          } else {
            self.$store.dispatch('user/signIn', { datas});
          }
          self.$emit('changeTab');
        }
      });
    },
    change() {
      this.$forceUpdate();
    },
    handlePaste() {}
  }
};
</script>
<style lang="scss" scoped>
.signUser {
  margin-top: px2rem(30);
  .el-input::before {
    position: absolute;
    content: '*';
    color: $absColor;
    margin-left: px2rem(-10);
  }
  .el-input {
    font-size: px2rem(14);
  }
  .sign {
    margin-top: px2rem(10);
    width: 100%;
  }
}
</style>
