<template>
  <div class="g-box">
    <el-dialog
      :title="title"
      :visible="dialogVisible"
      width="27%"
      :show-close="false"
    >
      <!--      表单-->
      <div style="margin-bottom: 30px; width: 80%; margin-left: 40px">
        <el-steps :active="active" process-status="process" finish-status="success">
          <el-step title="验证账号"></el-step>
          <el-step :title="stepTitle"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </div>

      <div>
        <el-form ref="userForm" :model="userForm" :rules="userRules"
                 label-position="right"
                 label-width="110px">
          <el-form-item label="验证方式：" v-if="active === 0">
            <el-select v-model="userForm.validate" placeholder="请选择验证方式" size="small">
              <el-option label="绑定手机" :value="0"></el-option>
              <el-option label="其他" :value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="原手机：" v-if="active === 0">
            <span>{{userForm.mobile}}</span>
          </el-form-item>

          <el-form-item label="验证码：" v-if="active === 0">
            <el-input v-model="userForm.code" size="small" placeholder="短信验证码"></el-input>
            <el-button type="primary" style="margin-left: 10px" size="small" @click="getCode">{{buttonText}}</el-button>
          </el-form-item>
          <el-form-item :label="fixName" prop="newPhone"
                        v-show="active === 1 && application === 'phone'"
                        :rules="[
                          { required: true, message: '请输入手机号', trigger: 'blur' }
                        ]">
            <el-input v-model="userForm.newPhone" size="small" placeholder="新手机号码"></el-input>
          </el-form-item>

          <el-form-item :label="fixName" v-show="active === 1 && application === 'passWord'"
                        prop="passWord">
            <el-input v-model="userForm.passWord" size="small" placeholder="密码"></el-input>
          </el-form-item>

          <el-form-item :label="fixName" v-show="active === 1 && application === 'company'" prop="companyName">
            <el-input v-model="userForm.companyName" size="small" placeholder="企业名"></el-input>
          </el-form-item>

        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" v-if="active === 0" @click="next">下一步</el-button>
        <el-button type="primary" v-if="active === 1" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import aes from '@/utils/aes';
import {
  getToken
} from '@/utils/auth';
import { httpValidateSms, httpFixPhone, httpGetCode, httpFixPassWord } from '@/api/selfCenter/self';

export default {
  name: 'modifyUserInformation',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 判断是改邮箱还是电话
    application: {
      type: String,
      default: 'phone'
    },
    userInformation: Object
  },
  data() {
    return {
      stepTitle: '',
      validate: /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9](?=.*[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、*?]){8,20}.*/,
      // 步骤条
      active: 0,
      // 表单数据
      userForm: {
        validate: 0,
        mobile: '',
        code: '',
        newEmail: '',
        newPhone: '',
        passWord: '',
        companyName: ''
      },
      title: '',
      codeUse: true,
      buttonText: '获取验证码',
      // 校验
      userRules: {
        passWord: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 20, message: '密码6-20个字符', trigger: 'blur'},
          {
            pattern: /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9](?=.*[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、*?]){8,20}.*/,
            message:
              '最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符'
          }
        ]
      }
    };
  },
  computed: {
    fixName() {
      return this.application === 'phone' ? '新手机号码' : this.application === 'passWord'
        ? '新密码' : this.application === 'company' ? '企业名称' : '新邮箱';
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.userForm.mobile = this.userInformation.mobile;
      this.title = this.application === 'phone' ? '绑定手机' : this.application === 'passWord'
        ? '修改密码' : this.application === 'company' ? '修改企业' : '绑定邮箱';
      this.stepTitle = this.application === 'phone' ? '修改手机' : this.application === 'passWord'
        ? '重置密码' : this.application === 'company' ? '修改企业' : '绑定邮箱';
    },
    next() {
      const _this = this;
      if (this.active === 0) {
        const data = {
          mobile: _this.userForm.mobile,
          checkCode: _this.userForm.code
        };
        httpValidateSms(data).then((res) => {
          if (res.code === 200) {
            this.$message.success('验证成功');
            this.active = this.active + 1;
          } else {
            return this.$message.error(res.message);
          }
        });
      }
    },
    // 修改手机接口
    requestChangePhone() {
      const token = getToken('token');
      const mobile = aes.encrypt(this.userForm.newPhone);
      const data = {
        token,
        mobile
      };
      httpFixPhone(data).then(res => {
        if (res.code === 200) {
          this.$message.success('修改手机号成功');
        }
      });
    },
    getCode() {
      const _this = this;
      if (_this.codeUse) {
        _this.codeUse = false;
        // let mobile = aes.encrypt(_this.userForm.mobile)
        const mobile = this.userForm.mobile;
        const data = {
          mobile
        };
        httpGetCode(data).then(res => {
          if (res.code === 200) {
            this.$message.success('获取成功');
            let timer = null;
            let count = 60;
            timer = setInterval(() => {
              count--;
              _this.buttonText = count + '秒';
              if (count <= 0) {
                clearInterval(timer);
                _this.buttonText = '获取验证码';
                _this.codeUse = true;
              }
            }, 1000);
          }
        });
      }
    },
    // 修改企业接口
    // requestChangeCompany() {
    //   const token = getToken('token');
    //   const companyName = this.userForm.companyName;
    //   const data = {token, companyName};
    //   request.post('api/updateCompanyName', data).then((res) => {
    //     if (res.code === 200) {
    //       this.$message.success('修改企业成功');
    //     }
    //   });
    // },
    // 修改密码接口
    requestChangeWord() {
      const _this = this;
      const token = getToken('token');
      const passWord = aes.encrypt(_this.userForm.passWord);
      const data = {token, passWord};
      httpFixPassWord(data).then(res => {
        if (res.code === 200) {
          this.$message.success('修改成功');
        }
      });
    },
    handleConfirm() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          const dto = this.application === 'phone' ? this.requestChangePhone : this.application === 'passWord'
            ? this.requestChangeWord : this.requestChangeCompany;
          dto();
          this.$emit('close-modal');
        }
      });
    },
    handleCancel() {
      this.$emit('close-modal');
    }
  }
};
</script>

<style scoped lang="scss">
.g-box {
  /deep/ .el-input {
    width: 170px
  }

  /deep/ .el-select .el-input {
    width: 273px;
  }
}
</style>
