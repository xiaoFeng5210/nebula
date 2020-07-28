<template>
  <div>
<!--    <commonHead :hideInfo="true"></commonHead>-->
    <div class="comeIn text-center">
      <h2>欢迎您，请从创建企业开始吧!</h2>
      <el-form label-position="left" label-width="100px" :model="formLabelAlign" :rules="rules" ref="comingForm">
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="formLabelAlign.companyName" :placeholder="subscriberName + '的企业'"></el-input>
        </el-form-item>
        <el-form-item label="企业性质" prop="companyNature">
          <el-select v-model="formLabelAlign.companyNature" placeholder="企业性质">
            <el-option label="甲方业主" value="甲方业主"></el-option>
            <el-option label="设计院" value="设计院"></el-option>
            <el-option label="施工总承包" value="施工总承包"></el-option>
            <el-option label="监理公司" value="监理公司"></el-option>
            <el-option label="咨询公司" value="咨询公司"></el-option>
            <el-option label="运维公司" value="运维公司"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业规模" prop="companyScale">
          <el-select v-model="formLabelAlign.companyScale" placeholder="企业规模">
            <el-option label="200以上" value="200人以上"></el-option>
            <el-option label="100-200人" value="100-200人"></el-option>
            <el-option label="20-50人" value="20-50人"></el-option>
            <el-option label="50-100人" value="50-100人"></el-option>
            <el-option label="10-20人" value="10-20人"></el-option>
            <el-option label="1-10人" value="1-10人"></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="企业描述" prop="companyDesc">-->
<!--          <el-input-->
<!--            v-model="formLabelAlign.companyDesc"-->
<!--            type="textarea"-->
<!--            :rows="2"-->
<!--            placeholder="请输入企业描述">-->
<!--          </el-input>-->
<!--        </el-form-item>-->
        <el-form-item class="text-center">
          <el-button type="primary" @click="onSubmit">完成创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { httpFindCompanyName, httpCreateCompany } from '@/api/comingApi/coming';
export default {
  name: 'comeIn',
  data() {
    return {
      userName: '',
      labelPosition: 'left',
      formLabelAlign: {
        companyName: '',
        companyNature: '甲方业主',
        companyScale: '200人以上'
      },
      //  校验规则
      rules: {
        companyName: [
          {required: true, message: '请输入企业名称', trigger: 'blur'},
          { max: 30, message: '企业名称必须30个字数以内', trigger: 'blur' }
        ],
        companyNature: [
          {required: true, message: '请选择企业性质', trigger: 'change'}
        ],
        companyScale: [
          {required: true, message: '请选择企业规模', trigger: 'change'}
        ]
        // companyDesc: [
        //   {required: true, message: '请输入企业描述', trigger: 'blur'}
        // ]
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs.comingForm.validate((valid) => {
        if (valid) {
          this.validateName();
        }
      });
    },
    //  拿到企业名称去查询接口校验是否重复
    validateName() {
      const _this = this;
      const data = {
        companyName: _this.formLabelAlign.companyName
      };
      httpFindCompanyName(data).then((response) => {
        if (response.code === 200 && !response.data) {
          this.createBusiness();
        } else if (response.code === 200 && response.data) {
          const name = response.data.companyName;
          if (name && name === _this.formLabelAlign.companyName) {
            return this.$message.info('该企业名称已被使用');
          }
        } else {
          return this.$message.error(response.message);
        }
      });
    },
    //  创建企业
    createBusiness() {
      const data = this.formLabelAlign;
      httpCreateCompany(data).then((response) => {
        if (response.code === 200) {
          this.$message.success('创建成功');
          this.$router.push({
            path: '/projectlist'
          });
        } else {
          return this.$message.warning(response.message);
        }
      });
    }
  },
  computed: {
    subscriberName() {
      return this.userName ? this.userName : '用户';
    }
  },
  mounted() {
    //  获取用户名
    const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
    this.userName = userInfo.nickName;
  }
};
</script>
<style lang="scss" scoped>
.comeIn {
  position: relative;
  width: 98vw;
  height: 98vh;
  background: $bgColor;
  margin: 0 auto;

  h2 {
    color: $font;
    display: inline-block;
    font-size: px2rem(28);
    font-weight: bold;
    margin: px2rem(100) 0 px2rem(50) 0;
  }

  .el-form {
    width: px2rem(400);
    margin: 0 auto;

    .el-input {
      width: 100%;
    }

    .el-select {
      width: 235px
    }

    .el-button {
      width: px2rem(200);
      margin: px2rem(20) px2rem(20) px2rem(20) 0;
    }
  }
}
</style>
