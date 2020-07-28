<template>
  <div class="proHeader">
    <el-row class="bg-white">
      <el-col :span="first? 12 : fifth ? 10 : 14">
        <div class="lefts">
          <span class="line"></span>
          <div class="titles">{{title.tab}}</div>
        </div>
      </el-col>
      <el-col :span="first? 12 : fifth ? 14 : 10" class="titstyle">
        <div class="buts" v-if="first">
          <el-button type="primary">邀请人员</el-button>
          <el-button type="primary">移动</el-button>
          <el-button type="primary">删除</el-button>
          <el-button class="dangers" type="primary">资料权限</el-button>
          <el-input placeholder="请输入内容" v-model="queryData" size="small" class="input-with-select">
            <el-select v-model="querySelect" slot="prepend" placeholder="请选择">
              <el-option label="组织" value="1"></el-option>
              <el-option label="人员" value="2"></el-option>
              <el-option label="用户电话" value="3"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
          </el-input>
        </div>
        <div class="buts" v-if="second">
          <el-button type="primary">同意通过</el-button>
          <el-button type="primary">拒绝</el-button>
          <el-button type="primary">删除</el-button>
          <el-input placeholder="请输入内容" v-model="queryData" size="small" class="input-with-select">
            <el-select v-model="querySelect" slot="prepend" placeholder="请选择">
              <el-option label="组织" value="1"></el-option>
              <el-option label="人员" value="2"></el-option>
              <el-option label="用户电话" value="3"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
          </el-input>
        </div>
        <div class="buts" v-if="third">
          <el-button type="primary">编辑</el-button>
        </div>
        <div class="buts" v-if="forth">
          <el-button type="primary">添加</el-button>
        </div>
        <div class="buts" v-if="fifth">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator=" ~ "
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-select v-model="value" placeholder="请选择">
            <el-option-group v-for="group in options" :key="group.label" :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-option-group>
          </el-select>
          <el-select v-model="value" placeholder="全部人员">
            <el-option-group v-for="group in options" :key="group.label" :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-option-group>
          </el-select>
          <el-button type="primary">筛选</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'proHeader',
  props: {
    title: Object
  },
  data() {
    return {
      queryData: '',
      querySelect: '1',
      first: true,
      second: false,
      third: false,
      forth: false,
      fifth: false,
      value1: '',
      options: [
        {
          label: '工作台',
          options: [
            {
              value: 'Shanghai',
              label: '上海'
            },
            {
              value: 'Beijing',
              label: '北京'
            }
          ]
        },
        {
          label: '用户',
          options: [
            {
              value: 'Chengdu',
              label: '成都'
            },
            {
              value: 'Shenzhen',
              label: '深圳'
            },
            {
              value: 'Guangzhou',
              label: '广州'
            },
            {
              value: 'Dalian',
              label: '大连'
            }
          ]
        }
      ],
      value: ''
    };
  },
  mounted() {},
  watch: {
    title: function(val) {
      switch (val.tab) {
        case '项目人员':
          this.first = true;
          this.second = false;
          this.third = false;
          this.forth = false;
          this.fifth = false;
          break;
        case '人员审核':
          this.first = false;
          this.second = true;
          this.third = false;
          this.forth = false;
          this.fifth = false;
          break;
        case '基本信息':
          this.first = false;
          this.second = false;
          this.third = true;
          this.forth = false;
          this.fifth = false;
          break;
        case '配置设置':
          this.first = false;
          this.second = false;
          this.third = false;
          this.forth = true;
          this.fifth = false;
          break;
        case '日志管理':
          this.first = false;
          this.second = false;
          this.third = false;
          this.forth = false;
          this.fifth = true;
          break;
        default:
          this.first = false;
          this.second = false;
          this.third = false;
          this.forth = false;
          this.fifth = false;
          break;
      }
    }
  },
  methods: {
    handleQuery() {},
    edit() {
      console.log(this.title, 'title');
    }
  }
};
</script>

<style lang="scss" scoped>
.titstyle {
  text-align: right;
  padding-right: 40px;
}
.buts {
  /deep/ .input-with-select {
    width: 350px;
  }
  /deep/ .el-select {
    width: 180px;
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
