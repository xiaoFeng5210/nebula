<template>
  <div class="loginUser">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="errorMsg text-left" v-if="errorMsg">
        用户名或密码有误,请重新输入或
        <span @click="tabIndex">
          <u>找回密码</u>
        </span>
      </div>
      <el-form-item prop="username">
        <el-input
          ref="username"
          placeholder="请输入用户名"
          v-model.trim="loginForm.username"
          maxlength="16"
          name="username"
          type="text"
          @input="change($event)"
          clearable
        />
      </el-form-item>

      <el-form-item prop="passworld">
        <el-input
          ref="password"
          v-model.trim="loginForm.passworld"
          type="password"
          placeholder="请输入密码"
          maxlength="20"
          name="password"
          @input="change($event)"
          @keyup.enter.native="Submits"
          show-password
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import aes from '@/utils/aes';
import { getUser, setUser, removeUser } from '@/utils/auth';
export default {
  name: 'loginUser',
  data() {
    return {
      loginForm: {
        username: '',
        passworld: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
          // { min: 4, max: 16, message: '用户名4-16个字符', trigger: 'blur' }
        ],
        passworld: [
          { required: true, message: '请输入密码', trigger: 'blur' }
          // { min: 8, max: 20, message: '密码8-20个字符', trigger: 'blur' }
          // {
          //   pattern: /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9](?=.*[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、*?]){8,20}.*/,
          //   message:
          //     '最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符',
          //   trigger: 'blur'
          // }
        ]
      },
      errorMsg: false,
      loading: false
    };
  },
  mounted() {
    const user = getUser();
    if (user && user !== 'undefined') {
      const users = JSON.parse(user);
      this.loginForm.username = users.userName;
      this.loginForm.passworld = aes.decrypt(users.passWord);
      this.$emit('check');
    }
  },
  methods: {
    Submits() {
      const self = this;
      self.$refs.loginForm.validate(valid => {
        if (valid) {
          const datas = {
            type: 1,
            userName: self.loginForm.username,
            passWord: aes.encrypt(self.loginForm.passworld)
          };
          self.$store.dispatch('user/login', datas);
        } else {
          return false;
        }
      });
    },
    save() {
      const self = this;
      const datas = {
        userName: self.loginForm.username,
        passWord: aes.encrypt(self.loginForm.passworld)
      };
      setUser(datas);
    },
    remo() {
      removeUser();
    },
    change() {
      this.$forceUpdate();
    },
    tabIndex() {
      this.$emit('check', 3);
    }
  },
  computed: {
    msg() {
      return this.$store.state.user.code;
    }
  },
  watch: {
    msg(val) {
      if (val === 301) {
        this.errorMsg = true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.loginUser {
  margin-top: px2rem(30);
  .el-input {
    font-size: px2rem(14);
  }
  .errorMsg {
    color: $eorr;
    font-size: px2rem(16);
    margin: px2rem(10) 0;
    span {
      color: $font;
      text-decoration: solid;
    }
  }
}
</style>
