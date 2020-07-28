<template>
  <div class="setHeader">
    <el-row class="bg-white">
      <el-col :span="14">
        <div class="lefts">
          <span class="line"></span>
          <div class="titles">{{title.tab}}</div>
        </div>
      </el-col>
<!--      class="din-flex jc-end"-->
      <el-col :span="10">
        <div class="buts">
          <el-button type="primary">移动</el-button>
          <el-button type="primary">移出企业</el-button>
          <!-- <el-button type="danger" v-if="title.id==1">拒绝</el-button> -->
          <!-- <el-button class="dangers" type="primary" v-if="title.id==0||title.id==1">删除</el-button> -->
          <el-input
            placeholder="请输入内容"
            v-model="queryData"
            size="small" class="input-with-select">
            <el-select v-model="querySelect" slot="prepend" placeholder="请选择">
              <el-option label="组织" value="1"></el-option>
              <el-option label="人员" value="2"></el-option>
              <el-option label="用户电话" value="3"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
          </el-input>
          <el-button class="dangers" type="primary" @click="addRoles" v-if="title.id==0">添加角色</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'setHeader',
  props: {
    title: Object
  },
  data() {
    return {
      queryData: '',
      querySelect: ''
    };
  },
  mounted() {},
  methods: {
    handleQuery() {
    },
    addRoles(){
       this.$emit("addUsers");
    }
  }
};
</script>

<style lang="scss" scoped>
.buts {
  /deep/ .input-with-select {
    width: 350px
  }
  /deep/ .el-select {
    width: 80px
  }
}
.el-row {
  .lefts {
    .line {
      width: px2rem(3);
      height: px2rem(18);
      background: $font;
      position: absolute;
      top: px2rem(20);
      left: px2rem(10);
      display: inline-block;
    }
    .titles {
      font-size: px2rem(18);
      text-indent: px2rem(20);
    }
  }
  .inputs {
    width: px2rem(240);
    margin-right: px2rem(20);
    /deep/ .el-input__inner {
      height: px2rem(34);
      line-height: px2rem(34);
      font-size: px2rem(12);
      color: $inputplace !important;
    }
  }

  .el-button--primary {
    border-color: $btnprim;
    background: $btnprim;
  }
  .el-button--primary:hover {
    background: $btnprimh;
  }
  .dangers {
    /*<!--border-color: $btnbor;-->*/
    /*<!--background: $btnbor;-->*/
    margin-right: px2rem(20);
  }
  .dangers:hover {
    border-color: $btnhover;
    background: $btnhover;
  }

  .el-button {
    padding: px2rem(10) px2rem(15);
  }
}
</style>
