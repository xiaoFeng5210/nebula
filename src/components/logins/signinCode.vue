<template>
  <div class="signinCode">
    <el-form
      ref="signForm"
      :model="signForm"
      :rules="signRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
      v-show="count!=3"
    >
      <el-form-item prop="phone">
        <el-input
          ref="phone"
          v-model="signForm.phone"
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
              v-model="signForm.code"
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
      <div class="clue text-right">
        未收到动态码,
        <a class="tels" @click="telshow">请联系人工客服</a>
      </div>
      <el-button class="sign" type="primary" @click.native.prevent="handleSign">下一步</el-button>
    </el-form>
    <div v-if="count==3">
      <slider ref="slider" @onSuccess="onSuccess"></slider>
    </div>
  </div>
</template>
<script>
import { getcode, verifycode } from '../../api/user';
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
      signForm: {
        phone: '',
        code: ''
      },
      signRules: {
        phone: [
          {
            type: 'number',
            required: true,
            validator: checkPhone,
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          },
          { min: 6, max: 6, message: '验证码为6位', trigger: 'blur' }
        ]
      },
      type: 'primary',
      buttonName: '获取验证码',
      isDisabled: false,
      time: 3,
      count: 0
    };
  },
  methods: {
    sendMsg() {
      const self = this;
      self.count++;
      self.$refs.signForm.validateField('phone', errMsg => {
        if (!errMsg && self.count < 3) {
          self.isDisabled = true;
          const interval = window.setInterval(function() {
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
          getcode({ mobile: self.signForm.phone, type: 2 }).then(res => {
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
    onSuccess() {
      this.$message.success('验证成功');
      setTimeout(() => {
        this.count = 1;
      }, 500);
    },
    handleSign() {
      const self = this;
      self.$refs.signForm.validate(valid => {
        if (valid) {
          verifycode({
            mobile: self.signForm.phone,
            checkCode: self.signForm.code
          }).then(res => {
            if (res.code === 200) {
              self.$emit('changeTab', {
                num: 6,
                code: self.signForm.code,
                moible: self.signForm.phone
              });
            } else {
              self.$message(res.message);
              self.count = 2;
              self.code = '';
            }
          });
        } else {
          return false;
        }
      });
    },
    telshow() {
      this.$emit('closeTel', true);
    },
    change() {
      this.$forceUpdate();
    }
  }
};
</script>
<style lang="scss" scoped>
.signinCode {
  margin-top: px2rem(80);
  .el-input {
    font-size: px2rem(14);
  }
  .el-col {
    border: px2rem(1) solid $col;
    .el-button {
      width: 100%;
    }
  }
  .clue {
    font-size: px2rem(12);
    margin-top: px2rem(80);
  }
  .tels {
    cursor: pointer;
  }
  .sign {
    margin-top: px2rem(10);
    width: 100%;
  }
}
</style>
