<template>
  <div class="setHeader">
    <el-row class="bg-white">
      <el-col :span="6">
        <div class="lefts">
          <span class="line"></span>
          <div class="titles">{{title.tab}}</div>
        </div>
      </el-col>
      <el-col :span="18" class="din-flex jc-end">
        <el-col :span="5" :offset="10">
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="value2"
            @change="handleCommand1"
          ></el-input>
        </el-col>
        <el-col :span="1" class="dropdown" :offset="1" style="position:relative;">
          <img class="imgs" src="../../assets/icon/tp3.png" alt srcset />
          <el-select @change="handleCommand" v-model="value3" trigger="hover" style="position: absolute;top:-10px;opacity:0;width: 30px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="1" class="dropdown">
          <span class="el-dropdown-link">
            <img class="imgs" src="../../assets/icon/tp1.png" alt srcset @click="checkModule" />
          </span>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addItem()">新建项目</el-button>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'setHeader',
  props: {
    title: {
      type: Object,
      default: {}
    },
    isshowimg: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      value: '',
      value2: '',
      value3: '23',
      islist: 0,
      options: [
        {
          value: '14',
          label: '项目大小-正序'
        },
        {
          value: '13',
          label: '项目大小-倒序'
        },
        {
          value: '24',
          label: '创建时间-正序'
        },
        {
          value: '23',
          label: '创建时间-倒序'
        }
      ]
    };
  },
  watch: {},
  mounted() {
    this.islist = this.isshowimg;
  },
  methods: {
    checkModule() {
      if (this.islist) {
        this.islist = 0;
      } else {
        this.islist = 1;
      }
      this.$emit('islist', this.islist);
      this.$store.commit('SET_SEARCHOBJ', {
        content: this.value2,
        sort: this.value3
      });
    },
    handleCommand(command) {
      this.$store.commit('SET_SEARCHOBJ', {
        content: this.value2,
        sort: command
      });
    },
    handleCommand1(command) {
      this.$store.commit('SET_SEARCHOBJ', {
        content: command,
        sort: this.value3
      });
    },
    addItem() {
      this.$emit('showdialog', 'add');
    }
  }
};
</script>

<style lang="scss" scoped>
.setHeader {
  /deep/.el-input--suffix .el-input__inner {
    padding-right: 0 !important;
    padding-left: 0 !important;
  }
  /deep/ .el-input__icon {
    width: 0 !important;
  }
  .el-row {
    .dropdown {
      margin-top: 16px;
      display: flex;
      .el-dropdown {
        flex: 1;
      }
    }
    .imgs {
      display: block;
      height: px2rem(26);
    }

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
      border-color: $btnbor;
      background: $btnbor;
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
  .formlabel {
    text-align: center;
  }
}
</style>
