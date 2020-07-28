<template>
  <div class="setHeader bg-white d-flex jc-between ai-center">
    <div class="lefts d-flex jc-between ai-center">
      <div class="line"></div>
      <div class="titles">{{title.tab}}</div>
    </div>
    <!--      class="din-flex jc-end"-->
    <div class="rights d-flex jc-between ai-center">
      <el-button type="primary" v-if="title.id==0">邀请人员</el-button>
      <el-button type="primary" v-if="isButtonActive">移动</el-button>
      <el-button type="danger" v-if="title.id==1">拒绝</el-button>
      <el-button
        class="dangers"
        plain
        type="danger"
        v-if="title.id==0||title.id==1"
        @click="deletes"
      >删除</el-button>
      <el-input placeholder="请输入内容" v-model="queryData" size="small" class="el-icon-search"></el-input>
      <el-select v-model="querySelect" slot="prepend" placeholder="请选择">
        <el-option label="组织" value="deptName"></el-option>
        <el-option label="岗位" value="jobName"></el-option>
        <el-option label="角色" value="projectRole"></el-option>
        <el-option label="真实姓名" value="realName"></el-option>
        <el-option label="用户名称" value="userName"></el-option>
        <el-option label="手机号" value="mobile"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'setHeader',
  props: {
    title: Object,
    isButtonActive: Boolean
  },
  data() {
    return {
      queryData: '',
      querySelect: ''
    };
  },
  mounted() {},
  methods: {
    handleQuery() {},
    deletes() {
      this.$emit('deletes');
    }
  }
};
</script>

<style lang="scss" scoped>
.setHeader {
  padding: 0 px2rem(20);
  .lefts {
    .line {
      width: px2rem(3);
      height: px2rem(18);
      background: $font;
    }
    .titles {
      font-size: px2rem(18);
    }
  }
  .rights {
    .el-input {
      width: px2rem(200);
    }
    /deep/ .el-input__inner {
      width: px2rem(200);
      height: px2rem(34);
      line-height: px2rem(34);
      font-size: px2rem(12);
      padding: 0 px2rem(30);
      color: $inputplace !important;
    }
    .el-icon-search::before {
      position: absolute;
      top: px2rem(10);
      left: px2rem(3);
    }
    .el-icon-arrow-up {
      position: absolute;
      right: px2rem(-3);
    }
    .dangers {
      margin-right: px2rem(20);
    }
    .dangers:hover {
      border-color: $btnhover;
      background: $btnhover;
    }

    .el-button {
      padding: px2rem(10) px2rem(15);
    }
    /deep/ .el-select {
      width: px2rem(120);
      margin-left: px2rem(20);
      /deep/ .el-input__inner {
        width: 100%;
        padding-right: px2rem(20);
      }
    }
  }
}
</style>
