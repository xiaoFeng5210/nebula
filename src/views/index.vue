<template>
  <div class="loginView">
    <div class="form bg-white">
      <!-- 登录  -->
      <div class="form-container" v-if="tabIndex==0||tabIndex==1|| tabIndex==2">
        <div class="form-head text-center">
          <img class="form-img" src="../assets/loginImages/logo.png" />
          <span>
            <img @click="changeTab(0)" v-if="tabIndex!=0" src="../assets/loginImages/wechat.png" />
            <img @click="changeTab(1)" v-if="tabIndex==0" src="../assets/loginImages/users.png" />
          </span>
        </div>
        <div class="qr-container text-center" v-if="tabIndex==0">
          <h5 class="title">微信二维码登录</h5>
          <div class="img-container">
            <!-- <img :src="isImg" /> -->
            <img
              src="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQEO8DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAycnpDMWxuZkNkbTMxM1dWNWh2MUoAAgR6--teAwSAOgkA"
            />
          </div>
          <span>请用打开微信“扫一扫”扫描二维码</span>
        </div>
        <div class="container" v-if="tabIndex==1|| tabIndex==2">
          <el-row>
            <el-col :span="3"></el-col>
            <el-col
              :span="7"
              class="text-center fs-sm clorss"
              :class="{'clors':tabIndex==1}"
              @click.native="changeTab(1)"
            >
              <span>账号密码登录</span>
            </el-col>
            <el-col :span="3"></el-col>
            <el-col
              :span="7"
              class="text-center fs-sm clorss"
              :class="{'clors':tabIndex==2}"
              @click.native="changeTab(2)"
            >
              <span>手机验证码登录</span>
            </el-col>
            <el-col :span="3"></el-col>
          </el-row>
          <div v-if="tabIndex==1">
            <loginUser ref="login" @check="check"></loginUser>
          </div>
          <div v-else-if="tabIndex==2">
            <loginCode ref="login"  @changeTab="changeTab"  @closeTel="closeTel"></loginCode>
          </div>
          <div class="fs-xs d-flex jc-between ai-center" v-if="tabIndex==1">
            <div>
              <el-checkbox-group v-model="checkeds">
                <el-checkbox>
                  <span class="opt text-dark">下次自动登录</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="text-right opt text-dark" @click="changeTab(3)">忘记密码?</div>
          </div>
          <el-button class="login" type="primary" @click.native.prevent="handleLogin">登 录</el-button>
        </div>
      </div>
      <!-- 注册  -->
      <div class="form-container text-center" v-if="tabIndex==5|| tabIndex==6">
        <div class="form-head text-center">
          <div class="title">欢迎注册！</div>
        </div>
        <div class="container">
          <div v-if="tabIndex==5">
            <signinCode ref="signIn" @changeTab="changeTab" @closeTel="closeTel"></signinCode>
          </div>
          <div v-else-if="tabIndex==6">
            <signinUser ref="signIn" :code="code" :phone="phone"></signinUser>
          </div>
        </div>
      </div>
      <!-- 忘记密码 -->
      <div class="form-container text-center" v-if="tabIndex==3||tabIndex==4">
        <div class="form-head text-center">
          <div class="title">手机找回密码</div>
        </div>
        <div class="container">
          <div v-if="tabIndex==3">
            <forgotCode @changeTab="changeTab" @closeTel="closeTel"></forgotCode>
          </div>
          <div v-else-if="tabIndex==4">
            <forgotPass :phone="phone" :code="code" @changeTab="changeTab(1)" :username="username"></forgotPass>
          </div>
          <div class="backs" @click="back">返回登录页面</div>
        </div>
      </div>
      <div class="form-footer text-center" v-if="tabIndex==5||tabIndex==6">
        已有账号，
        <span @click="changeTab(1)">立即登录</span>
      </div>
      <div class="form-footer text-center" v-if="tabIndex==0||tabIndex==1||tabIndex==2">
        没有账号?
        <span @click="changeTab(5)">立即注册</span>
      </div>
    </div>
    <div class="telep" v-if="Telshow">
      <div class="tels bg-white">
        <div class="tops">
          <img src="../../src/assets/icon/telep.png" />
          <span class="msg">服务电话：021-57835688</span>
        </div>
        <div class="bots text-right">
          <el-button size="mini" type="primary" @click="closeTel(false)">确认</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import loginUser from '@/components/logins/loginUser';
import loginCode from '@/components/logins/loginCode';
import signinUser from '@/components/logins/signinUser';
import signinCode from '@/components/logins/signinCode';
import forgotCode from '@/components/logins/forgotCode';
import forgotPass from '@/components/logins/forgotPass';
// import { getTicket } from '@/api/user';
export default {
  name: 'loginAndSigin',
  components: {
    loginUser,
    loginCode,
    signinUser,
    signinCode,
    forgotCode,
    forgotPass
  },
  data() {
    return {
      tabIndex: 1,
      checkeds: false,
      remember: '记住密码',
      phone: '',
      code: '',
      username: '',
      isImg: '',
      hint: false,
      diaShow: false,
      Telshow: false
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      // getTicket().then(res => {
      //   this.isImg =
      //     'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res;
      // });
    });
  },
  methods: {
    changeTab(val) {
      if (val.moible) {
        this.tabIndex = val.num;
        this.phone = val.moible;
        this.code = val.code;
        if (val.userName) {
          this.username = val.userName;
        }
      } else {
        this.tabIndex = val;
      }
    },
    handleLogin() {
      if (this.checkeds === true) {
        this.$refs.login.save();
      } else {
        this.$refs.login.remo();
      }
      this.$refs.login.Submits();
    },
    check(num) {
      if (num) {
        this.tabIndex = num;
      } else {
        this.checkeds = true;
      }
    },
    back() {
      this.tabIndex = 1;
    },
    closeTel(Boole) {
      this.Telshow = Boole;
    }
  },
  destroyed() {}
};
</script>
<style lang="scss" scoped>
.loginView {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/loginImages/bg-login.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .form {
    position: relative;
    width: px2rem(618);
    height: px2rem(527);
    padding: px2rem(10);
    top: 50%;
    left: 50%;
    border-radius: px2rem(10);
    transform: translate(-50%, -50%);
    -moz-box-shadow: 0 0 px2rem(10) $bor; /* 老的 Firefox */
    box-shadow: 0 0 px2rem(10) $bor;
    .form-container {
      .form-head {
        .title {
          color: $font;
          font-size: px2rem(32);
          font-weight: bold;
          margin: px2rem(60) 0 px2rem(20) 0;
        }
        .form-img {
          width: px2rem(214);
          height: px2rem(77);
          margin: px2rem(20) 0 px2rem(20) 0;
          display: inline-block;
        }
        span {
          width: px2rem(50);
          height: px2rem(50);
          position: absolute;
          top: px2rem(10);
          right: px2rem(10);
          display: inline-block;
          img {
            cursor: pointer;
            width: 100%;
            display: inline-block;
          }
        }
      }
      .qr-container {
        h5 {
          font-size: px2rem(16);
          color: $font;
          font-weight: bold;
          margin: px2rem(10) 0;
        }
        span {
          display: inline-block;
          color: $span;
          font-size: px2rem(16);
          margin: px2rem(10) 0 px2rem(30) 0;
        }
        img {
          width: px2rem(200);
          height: px2rem(200);
          margin: px2rem(10);
        }
      }
      .container {
        width: 80%;
        margin: px2rem(30) auto;
        margin-bottom: 0;
        .el-col {
          cursor: pointer;
          padding: px2rem(0.1);
        }
        .clorss {
          color: $deepGre;
        }
        .clors {
          color: $font;
          span {
            font-size: px2rem(16);
            font-weight: bold;
            display: inline-block;
            padding-bottom: px2rem(10);
            border-bottom: px2rem(1) solid $font;
          }
        }
        .backs {
          color: $font;
          cursor: pointer;
          font-size: px2rem(16);
          margin: px2rem(20) 0;
        }
        .opt {
          cursor: pointer;
          font-size: px2rem(14);
        }
        .login {
          margin-top: px2rem(10);
          width: 100%;
        }
      }
    }
  }
  .form-footer {
    font-size: px2rem(14);
    margin-top: px2rem(20);
    span {
      color: $font;
      display: inline-block;
      cursor: pointer;
    }
  }
  .telep {
    position: absolute;
    top: 0;
    left: 0;
  }
  .tels {
    width: px2rem(350);
    height: px2rem(155);
    border-radius: px2rem(5);
    padding: px2rem(20);
    position: fixed;
    bottom: 5%;
    right: 6%;
    box-shadow: 0 0 px2rem(10) $title;
    .tops {
      margin-top: px2rem(38);
      font-size: px2rem(16);
      img {
        width: px2rem(28);
        height: px2rem(26);
        position: absolute;
      }
      .msg {
        display: inline-block;
        margin-left: px2rem(35);
        margin-top: px2rem(6);
      }
    }
    .bots {
      margin-top: px2rem(10);
    }
  }
}
</style>
