<template>
  <div class="forgotUser">
    <el-form
      ref="forgotForm"
      :model="forgotForm"
      :rules="forgotRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="user-font text-left text-dark">您正在找回的账号是 <span>{{userName}}</span></div>
      <el-form-item prop="password">
        <el-input
          ref="password"
          v-model.trim="forgotForm.password"
          type="password"
          placeholder="请设置登录密码"
          maxlength="20"
          name="password"
          @input="change($event)"
          @paste.native.capture.prevent="handlePaste"
          show-password
        />
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input
          ref="checkPass"
          type="password"
          v-model.trim="forgotForm.checkPass"
          placeholder="请再次输入密码"
          maxlength="20"
          name="checkPass"
          @input="change($event)"
          @paste.native.capture.prevent="handlePaste"
          show-password
        />
      </el-form-item>
      <el-button
        class="forgot"
        :loading="loading"
        type="primary"
        @click.native.prevent="handleSign"
      >确定</el-button>
    </el-form>
  </div>
</template>
<script>
import aes from '@/utils/aes';
import { updatePass } from '../../api/user';
export default {
  name: 'forgotUser',
  props: {
    code: String,
    phone: String,
    username: String
  },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请再次输入密码'));
      } else if (value !== this.forgotForm.password) {
        return callback(new Error('两次输入密码不一致!'));
      } else {
        return callback();
      }
    };
    return {
      forgotForm: {
        password: '',
        checkPass: ''
      },
      forgotRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码6-20个字符', trigger: 'blur' },
          {
            pattern: /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9](?=.*[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、*?]){8,20}.*/,
            message:
              '最少8位，包括至少1个大写字母，1个小写字母，1个数字或个特殊字符'
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
      loading: false,
      passwordType: 'password',
      userName: this.$props.username
    };
  },
  mounted() {
    console.log(this.$props);
  },
  methods: {
    handleSign() {
      const self = this;
      self.$refs.forgotForm.validate(valid => {
        if (valid) {
          const datas = {
            mobile: self.$props.phone,
            code: self.$props.code,
            passWord: aes.encrypt(self.forgotForm.password)
          };
          updatePass(datas).then(res => {
            if (res.code === 200) {
              self.$emit('changeTab');
            }
          });
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
.forgotUser {
  margin-top: px2rem(30);
  .el-input {
    font-size: px2rem(14);
  }
  .forgot {
    margin-top: px2rem(80);
    width: 100%;
  }
  .user-font {
    font-size: px2rem(16);
    margin: px2rem(30) 0;
    span{
      color: $font;
    }
  }
}
</style>
