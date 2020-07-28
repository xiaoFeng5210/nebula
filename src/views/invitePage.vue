<template>
  <div class="invite">
    <div class="headd"></div>
    <div class="content" v-if="true">
      <el-row>
        <div style="text-align:center">
          <img src="../assets/loginImages/logo.png" alt />
        </div>
      </el-row>
      <el-row class="content_tit">用户名<span>{{userName}}</span>邀请你加入组织：<span>{{projectName}}</span></el-row>
      <el-row>
        <el-input placeholder="请输入内容" v-model="input1">
          <template slot="prepend">+86</template>
        </el-input>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-input placeholder="请输入内容" v-model="input2"></el-input>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-button type="primary">获取验证码</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-button type="primary" plain class="btnw">下一步</el-button>
      </el-row>
    </div>
    <div class="content" v-if="false">
      <el-row>
        <div style="text-align:center">
          <img src="../assets/loginImages/logo.png" alt />
        </div>
      </el-row>
      <el-row class="content_tit">您已注册过星云账号，可点击按钮继续</el-row>
      <el-row>
        <el-button type="primary" plain class="btnw">申请加入</el-button>
      </el-row>
    </div>
    <div class="content" v-if="false">
      <el-row>
        <div style="text-align:center">
          <img src="../assets/loginImages/logo.png" alt />
        </div>
      </el-row>
      <el-row class="content_tit">您未注册过星云账号，请完善信息后加入</el-row>
      <el-row>
        <el-button type="primary" plain class="btnw">继续完善信息</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'invitePage',
  data() {
    return {
      input1: '',
      input2: '',
      userName: '杨子',
      projectName: '杨子的项目'
    };
  }
};
</script>
<style lang="scss" scoped>
.invite {
  width: 60%;
  background: $bgColor;
  padding-bottom: 60px;
  margin: 10% auto;
  .headd {
    height: 24px;
    background: $bluebor;
  }
  .content {
    width: 420px;
    margin: 0 auto;
    .el-row {
      margin-top: 20px;
    }
    .content_tit {
      font-size: 22px;
      color: $bluebor;
      font-weight: bold;
    }
    .btnw {
      width: 420px;
    }
  }
}
</style>
