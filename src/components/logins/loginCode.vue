<template>
  <div class="loginCode">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
      v-show="count!=3"
    >
      <div class="errorMsg text-left" v-if="errorMsg">手机号或验证码有误</div>
      <el-form-item prop="phone">
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="请输入手机号"
          name="phone"
          type="text"
          maxlength="11"
          oninput="value=value.replace(/[^\d.]/g,'')"
          @input="change($event)"
          clearable
        />
      </el-form-item>

      <el-form-item prop="code">
        <el-row>
          <el-col :span="15">
            <el-input
              v-model="loginForm.code"
              placeholder="请输入验证码"
              name="code"
              type="text"
              maxlength="6"
              oninput="value=value.replace(/[^\d.]/g,'')"
              @input="change($event)"
              clearable
            />
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="8" class="text-right">
            <el-button
              class="code fs-sm"
              :type="type"
              plain
              :disabled="isDisabled"
              @click="sendMsg"
            >{{buttonName}}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div class="clue text-right">
      未收到动态码,
      <a class="tels" @click="telshow">请联系人工客服</a>
    </div>
    <div v-if="count==3">
      <slider ref="slider" @onSuccess="onSuccess"></slider>
    </div>
  </div>
</template>
<script>
import { getcode } from '../../api/user';
import slider from '../sliding/slider';
export default {
  name: 'loginCode',
  components: {
    slider
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      if (!value) {
        return callback(new Error('请输入手机号'));
      }
      setTimeout(() => {
        if (phoneReg.test(value)) {
          return callback();
        } else {
          return callback(new Error('手机号码格式不正确'));
        }
      }, 100);
    };
    return {
      loginForm: {
        phone: '',
        code: ''
      },
      loginRules: {
        phone: [
          {
            required: true,
            validator: checkPhone,
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '验证码为6位', trigger: 'blur' }
        ]
      },
      buttonName: '获取验证码',
      type: 'primary',
      isDisabled: false,
      time: 3,
      count: 0,
      errorMsg: false
    };
  },
  methods: {
    sendMsg() {
      const self = this;
      self.count++;
      self.$refs.loginForm.validateField('phone', (errMsg) => {
        if (!errMsg && self.count < 3) {
          self.isDisabled = true;
          const interval = window.setInterval(function () {
            self.buttonName = '正在发送(' + self.time + '秒)';
            --self.time;
            self.type = 'info';
            if (self.time < 0) {
              self.buttonName = '获取验证码';
              self.time = 3;
              self.type = 'primary';
              self.isDisabled = false;
              window.clearInterval(interval);
            }
          }, 1000);
          getcode({ mobile: self.loginForm.phone, type: 1 }).then((res) => {
            if (res.code === 200) {
              self.$message.success('发送成功');
            } else {
              self.$message.error(res.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    Submits() {
      const self = this;
      self.$refs.loginForm.validate((valid) => {
        if (valid) {
          const datas = {
            type: 2,
            mobile: self.loginForm.phone,
            code: self.loginForm.code
          };
          self.$store.dispatch('user/login', datas);
        } else {
          return false;
        }
      });
    },
    onSuccess() {
      this.$message.success('验证成功');
      setTimeout(() => {
        this.count = 1;
      }, 500);
    },
    change() {
      this.$forceUpdate();
    },
    remo() {},
    telshow() {
      this.$emit('closeTel', true);
    }
  },
  computed: {
    msg() {
      return this.$store.state.user.code;
    }
  },
  watch: {
    msg(val) {
      const self = this;
      if (val === 301) {
        self.errorMsg = true;
      } else if (val === 302) {
        self.$emit('changeTab', {
          num: 6,
          code: self.loginForm.code,
          moible: self.loginForm.phone
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.loginCode {
  margin-top: px2rem(30);
  .el-input {
    font-size: px2rem(14);
  }
  .el-col {
    border: px2rem(1) solid $col;
    .el-button {
      width: 100%;
    }
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
  .tels {
    cursor: pointer;
  }
  .clue {
    font-size: px2rem(12);
    margin-top: px2rem(20);
  }
}
</style>
