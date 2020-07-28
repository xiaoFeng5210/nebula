<template>
  <div class="forgotCode">
    <el-form
      ref="forgotForm"
      :model="forgotForm"
      :rules="forgotRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
      v-show="count!=3"
    >
      <el-form-item prop="phone" v-if="active===0">
        <el-input
          class="input-phone"
          ref="phone"
          v-model="forgotForm.phone"
          placeholder="请输入手机号"
          name="phone"
          type="text"
          maxlength="11"
          oninput="value=value.replace(/[^\d.]/g,'')"
          @input="change($event)"
          clearable
        />
      </el-form-item>
      <div class="phone-font text-left text-dark" v-if="active===1">{{phones}}手机</div>
      <el-form-item prop="code" v-if="active===1">
        <el-row>
          <el-col :span="15">
            <el-input
              v-model="forgotForm.code"
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
        <div class="btn-tlte" v-if="active===1">
          未收到动态码,
          <a class="tels" @click="telshow">请联系人工客服</a>
        </div>
        <el-button class="sign" type="primary" @click.native.prevent="handleforgot">下一步</el-button>
      </div>
    </el-form>
    <div v-if="count==3">
      <slider ref="slider" @onSuccess="onSuccess"></slider>
    </div>
  </div>
</template>
<script>
import { getcode, validas } from '../../api/user';
import slider from '../sliding/slider';
export default {
  name: 'forgotCode',
  components: {
    slider
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      if (!value) {
        return callback(new Error('请输入手机号'));
      } else if (phoneReg.test(value)) {
        return callback();
      } else {
        return callback(new Error('电话号码格式不正确'));
      }
    };
    return {
      forgotForm: {
        phone: '',
        code: ''
      },
      forgotRules: {
        phone: [
          {
            type: 'number',
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
      type: 'primary',
      buttonName: '获取验证码',
      isDisabled: false,
      active: 0,
      time: 3,
      count: 0
    };
  },
  computed: {
    phones: function() {
      const p = this.forgotForm.phone;
      return p.substring(0, 3) + '****' + p.substring(7, p.length);
    }
  },
  methods: {
    sendMsg() {
      const self = this;
      self.count++;
      self.isDisabled = true;
      if (self.count < 3) {
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
        getcode({ mobile: self.forgotForm.phone, type: 3 }).then(res => {
          if (res.code === 200) {
            self.$message.success('发送成功');
          }
        });
      }
    },
    onSuccess() {
      this.$message.success('验证成功');
      setTimeout(() => {
        this.count = 4;
      }, 500);
    },
    handleforgot() {
      const self = this;
      if (self.active === 0) {
        self.$refs.forgotForm.validateField('phone', errMsg => {
          if (!errMsg) {
            self.active = 1;
          } else {
            return false;
          }
        });
      } else {
        validas({
          mobile: self.forgotForm.phone,
          checkCode: self.forgotForm.code
        }).then(res => {
          if (res.code === 200) {
            self.$emit('changeTab', {
              num: 4,
              userName: res.data,
              code:self.forgotForm.code,
              moible: self.forgotForm.phone
            });
          } else {
            self.$message(res.message);
            self.count = 2;
            self.code = '';
          }
        });
      }
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
.forgotCode {
  margin-top: px2rem(80);
  .el-input {
    font-size: px2rem(14);
  }
  .input-phone {
    margin-top: px2rem(30);
  }
  .el-col {
    border: px2rem(1) solid $col;
    .el-button {
      width: 100%;
    }
  }
  .phone-font {
    font-size: px2rem(16);
    margin: px2rem(10) 0;
  }
  .clue {
    font-size: px2rem(12);
    margin-top: px2rem(120);
    .btn-tlte {
      margin-bottom: px2rem(10);
    }
    .tels {
      cursor: pointer;
    }
    .sign {
      width: 100%;
    }
  }
}
</style>
