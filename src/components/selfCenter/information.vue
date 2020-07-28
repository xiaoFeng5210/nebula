<template>
  <div class="infomation">
    <div>
      <div class="div-top">
        <div class="title">个人信息</div>
        <div class="container" >
          <div>
            <el-row>
              <el-col :span="4" class="text-center">
                <!-- <img src="../../assets/loginImages/qr-code.png" /> -->
              </el-col>
              <el-col :span="10">
                <div>姓名：{{userInformation.userName}}</div>
                <div>系统角色：{{userInformation.roleName}}</div>
              </el-col>
            </el-row>
          </div>
          <div class="lii">
            <span>ID编号：</span>22558496666
          </div>
          <div class="lii">
            <el-row>
              <el-col :span="5">
                <span>当前企业：</span>
              </el-col>
              <el-col :span="15">
                <span>{{userInformation.companyName}}</span>
              </el-col>
<!--              <el-col :span="4">-->
<!--                <el-button type="warning" plain @click="handleFixCompanyName()">修改</el-button>-->
<!--              </el-col>-->
            </el-row>
          </div>
<!--          <div class="lii">-->
<!--            <el-row>-->
<!--              <el-col :span="4">-->
<!--                <span>岗位：</span>-->
<!--              </el-col>-->
<!--              <el-col :span="16">施工员</el-col>-->
<!--              <el-col :span="1">-->
<!--                <el-button type="primary" plain style="margin-left: 2px">编辑</el-button>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--          </div>-->
          <div class="lii">
            <el-row>
              <el-col :span="4">
                <span>邮箱：</span>
              </el-col>
              <el-col :span="16">{{userInformation.email}}</el-col>
              <el-col :span="1">
                <el-button type="warning" plain @click="handleFixEmail()">修改</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="lii">
            <el-row>
              <el-col :span="4">
                <span>手机：</span>
              </el-col>
              <el-col :span="16">{{userInformation.mobile}}</el-col>
              <el-col :span="1">
                <el-button type="warning" plain @click="handleFixPhone()">修改</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="div-bot">
        <div class="title">账号安全</div>
        <div class="container">
          <div class="lii">
            <el-row>
              <el-col :span="4">
                <span>密码：</span>
              </el-col>
              <el-col :span="16">*************</el-col>
              <el-col :span="1">
                <el-button type="primary" plain @click="changePassWord()">编辑</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="lii">
            <el-row>
              <el-col :span="4">
                <span>微信：</span>
              </el-col>
              <el-col :span="16">容秉匠科技</el-col>
              <el-col :span="1">
                <el-button type="danger" plain @click="unbindWechat">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>

    <ModifyUserInformation :dialogVisible="isModifyUserModalVisible"
                           :application="application"
                           :userInformation="userInformation"
                           v-if="isModifyUserModalVisible" @close-modal="handleCloseModal"/>
    <unbindModal @close-modal="handleCloseUnbindModa"
                 :dialogVisible="isUnbindModalVisible"
                 v-if="isUnbindModalVisible"/>
  </div>
</template>
<script>
import ModifyUserInformation from './modifyUserInformation';
import unbindModal from './unbindModal';
// import request from '@/utils/request';
import { getToken } from '@/utils/auth';
import { httpGetUserInfo } from '@/api/selfCenter/self';

export default {
  name: 'infomation',
  components: {
    ModifyUserInformation,
    unbindModal
  },
  data() {
    return {
      isUnbindModalVisible: false,
      isModifyUserModalVisible: false,
      isCompanyModalVisible: false,
      application: '',
      userDataList: [{
        userName: 'xiaofeng',
        roleName: '233',
        mobile: '15105215616'
      }],
      userInformation: {
        companyName: '',
        email: '',
        id: '',
        mobile: '',
        nickName: '',
        roleName: '',
        userName: ''
      }
    };
  },
  mounted() {
    this.getUsersDetail();
  },
  methods: {
    // 调用户信息接口
    getUsersDetail() {
      const _this = this;
      const token = getToken('token');
      const data = {
        token: token
      };
      httpGetUserInfo(data).then(res => {
        if (res.code === 200) {
          _this.userInformation = res.data;
        }
      });
    },
    handleOpenModal() {
      this.isModifyUserModalVisible = true;
    },
    handleFixCompanyName() {
      this.application = 'company';
      this.handleOpenModal();
    },
    handleFixEmail() {
      this.application = 'email';
      this.handleOpenModal();
    },
    handleFixPhone() {
      this.application = 'phone';
      this.handleOpenModal();
    },
    changePassWord() {
      this.application = 'passWord';
      this.handleOpenModal();
    },
    unbindWechat() {
      this.isUnbindModalVisible = true;
    },
    // 关闭modal框
    handleCloseModal() {
      this.isModifyUserModalVisible = false;
    },
    handleCloseUnbindModa() {
      this.isUnbindModalVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.infomation {
  position: relative;
  width: 100%;
  height: 100%;
  padding: px2rem(5);
  .title {
    color: $title;
    font-size: px2rem(16);
    font-weight: bold;
  }
  .div-top {
    padding: px2rem(20);
    padding-bottom: px2rem(30);
    margin-bottom: px2rem(30);
    border-bottom: px2rem(1) solid $selfbor;
    .container {
      width: px2rem(400);
      margin: px2rem(20);
      img {
        width: px2rem(50);
        height: px2rem(50);
        margin: px2rem(5) auto;
        border-radius: 50%;
        display: inline-block;
      }
      .el-col {
        color: $rightfontC;
        line-height: px2rem(30);
        font-size: px2rem(14);
        .el-button {
          font-size: px2rem(12);
          padding: px2rem(6) px2rem(15);
        }
      }
      .lii {
        color: $rightfontC;
        line-height: px2rem(30);
        font-size: px2rem(14);
        margin: px2rem(20) 0;
        margin-left: px2rem(20);
      }
    }
  }
  .div-bot {
    padding: px2rem(20);
    .container {
      width: px2rem(400);
      margin: px2rem(20);
      .lii {
        color: $rightfontC;
        line-height: px2rem(30);
        font-size: px2rem(14);
        margin: px2rem(20) 0;
        margin-left: px2rem(20);
        .el-button {
          font-size: px2rem(12);
          padding: px2rem(6) px2rem(15);
        }
      }
    }
  }
}
</style>
