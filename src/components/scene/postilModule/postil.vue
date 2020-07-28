<template>
  <div class="postil">
    <div class="brief" v-if="!isList && !details">
      <div class="tops">
        <div class="titles d-flex jc-between ai-center">
          <div>批注管理</div>
          <div class="closeBtn" @click="close">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div class="navbtn d-flex jc-between ai-center">
          <el-button class="el-icon-plus" @click="changePos(1)" type="primary">新建批注</el-button>
          <el-button class="el-icon-s-unfold" type="primary" @click="changePos(2)">列表视图</el-button>
        </div>
        <div class="serchs">
          <div class="rows d-flex jc-start ai-center">
            <div class="tag-t">标签:</div>
            <div>
              <el-select v-model="value1" placeholder="全部" @change="sercList">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="rows d-flex jc-start ai-center">
            <div class="tag-t">日期:</div>
            <div>
              <el-select v-model="value3" placeholder="全部" @change="sercList">
                <el-option
                  v-for="item in options3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div>
              <el-date-picker
                v-model="value3"
                @change="sercList"
                type="dates"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
          </div>
        </div>
        <div class="serch-input text-center">
          <el-input
            v-model="searchName"
            @keyup.enter.native="searchEnterFun"
            type="text"
            placeholder="请输入搜索内容"
          >
            <i slot="prefix" @click="searchEnterFun" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>
      <div class="container">
        <rightTab
          ref="rightTab"
          @currentChange="currentChange"
          @showDetil="showDetil"
          :posTiList="posTiList"
        ></rightTab>
      </div>
    </div>
    <div class="divsts" v-if="isList && !details">
      <div class="header d-flex jc-between ai-center">
        <div class="left-head">
          <span class="divne"></span>
          <span class="titles">批注管理</span>
        </div>
        <div class="right-head d-flex jc-between ai-center">
          <div class="select">
            <el-select v-model="value1" placeholder="全部" @change="sercList">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="select">
            <el-select v-model="value2" placeholder="全部" @change="sercList">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="select select3">
            <el-select v-model="value3" placeholder="全部" @change="sercList">
              <el-option
                v-for="item in options3"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="text-center">
            <el-date-picker
              v-model="value3"
              @change="sercList"
              type="dates"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
          <div class="dele">
            <el-button type="danger" plain size="mini" @click="delels">删除</el-button>
          </div>
          <div class="inputs">
            <el-input
              placeholder="请输入视口名称"
              @keyup.enter.native="searchEnterFun"
              v-model="searchName"
            >
              <i slot="prefix" @click="searchEnterFun" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="btn">
            <el-button type="primary" size="mini" @click="changePos(3)">切换至简约模式</el-button>
          </div>
        </div>
      </div>
      <div class="container bg-white">
        <listTab ref="listTab" @getList="getList" @showDetil="showDetil" :posTiList="posTiList"></listTab>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="currentChange"
          :page-size="7"
          :current-page="pages"
        ></el-pagination>
      </div>
    </div>
    <discussPotil :idsDetils="idsDetils" @closedetial="closedetial" v-if="details"></discussPotil>
  </div>
</template>
<script>
import rightTab from './rightTab';
import listTab from './listTab';
import discussPotil from './discussPotil';
import { getPostilList } from '@/api/postil';
export default {
  name: 'postil',
  components: {
    rightTab,
    listTab,
    discussPotil
  },
  data() {
    return {
      isList: false,
      options1: [
        {
          value: '2',
          label: '我参与的'
        },
        {
          value: '1',
          label: '我创建的'
        }
      ],
      options2: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '2',
          label: '安全问题'
        },
        {
          value: '1',
          label: '质量问题'
        }
      ],
      options3: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '3',
          label: '最近三天'
        },
        {
          value: '7',
          label: '最近七天'
        }
      ],
      value1: '',
      value2: '',
      value3: '',
      searchName: '',
      totals: 0,
      size: 7,
      pages: 1,
      posTiList: [],
      details: false,
      idsDetils: ''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const _this = this;
      const datas = {
        page: parseInt(_this.pages),
        size: _this.size,
        tag: parseInt(_this.value2),
        partIn: parseInt(_this.value1),
        day: parseInt(_this.value3),
        name: _this.searchName,
        projectId: localStorage.getItem('projectId')
      };
      getPostilList(datas).then(res => {
        if (res.code === 200) {
          _this.posTiList = res.data.list;
          _this.total = res.data.total;
        }
      });
    },
    changePos(num) {
      if (num === 2) {
        this.isList = true;
      } else if (num === 3) {
        this.isList = false;
      }
      this.value1 = '';
      this.value3 = '';
      this.$emit('newpano', num);
      const datas = {
        page: 1,
        size: this.size,
        projectId: 'res_gaohangyou_20200423'
      };
      getPostilList(datas).then(res => {
        if (res.code === 200) {
          this.posTiList = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    close() {
      this.$emit('newpano', 4);
    },
    delels() {
      this.$refs.listTab.deletas();
    },
    showDetil(obj) {
      this.details = true;
      this.idsDetils = obj;
      this.$emit('newpano', 2);
    },
    closedetial() {
      if (this.isList === false) {
        this.$emit('newpano', 3);
      }
      this.getList();
      this.details = false;
    },
    sercList() {
      if (this.value3.length !== 2 && typeof this.value3 !== 'string') {
        this.$message.error('开始日期与截至日期');
      } else {
        this.getList();
      }
    },
    searchEnterFun() {
      this.getList();
    },
    currentChange(val) {
      if (val < this.total / 7) {
        this.pages = val;
        this.getList();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.postil {
  .brief {
    width: px2rem(332);
    height: 300%;
    position: absolute;
    right: 0;
    z-index: 1000;
    background: $bgColor;
    .titles {
      padding: px2rem(10);
      font-size: px2rem(14);
      border-bottom: px2rem(1) sodivd $borBottom;
    }
    .navbtn {
      padding: px2rem(10);
      border-bottom: px2rem(1) sodivd $borBottom;
      .el-button {
        padding: px2rem(8) px2rem(14);
      }
    }
    .closeBtn {
      cursor: pointer;
      width: px2rem(20);
      height: px2rem(20);
    }
    .rows {
      margin: px2rem(10) 0;
      padding: 0 px2rem(10);
      font-size: px2rem(14);
      .tag-t {
        width: px2rem(50);
      }
      .el-select {
        width: px2rem(220);
        /deep/ .el-input {
          input {
            height: px2rem(34) !important;
            padding: 0 px2rem(10);
            font-size: px2rem(14);
          }
          /deep/ .el-icon-arrow-up:before {
            position: absolute;
            margin-top: px2rem(-10);
          }
        }
      }
      .select3 {
        .el-select {
          width: px2rem(320);
        }
      }
      /deep/ .el-date-editor {
        width: px2rem(30);
        margin: 0;
        /deep/ .el-input {
          width: px2rem(30);
        }
      }
    }
    .serch-input {
      /deep/ .el-input {
        width: 96%;
        margin: px2rem(10) auto;
        input {
          height: px2rem(38) !important;
          padding: 0 px2rem(10);
          text-indent: px2rem(15);
        }
      }
    }
    .el-icon-search:before {
      cursor: pointer;
      display: inline-block;
      position: absolute;
      margin-top: px2rem(-5);
      margin-left: px2rem(-12);
    }
  }
  .divsts {
    width: 100%;
    height: 100%;
    .header {
      height: px2rem(60);
      line-height: px2rem(60);
      margin-left: px2rem(10);
      padding: 0 px2rem(20);
      background: $bgColor;
      .left-head {
        .divne {
          width: px2rem(2);
          height: px2rem(16);
          display: indivne-block;
          background: $font;
        }
        .titles {
          margin-left: px2rem(10);
        }
      }
      .right-head {
        .select {
          .el-select {
            width: px2rem(180);
            margin: 0 px2rem(20);
            /deep/ .el-input {
              input {
                font-size: px2rem(14);
                height: px2rem(38) !important;
              }
            }
          }
        }
        .inputs {
          /deep/ .el-input {
            width: px2rem(246);
            margin: 0 px2rem(20);
            input {
              height: px2rem(38) !important;
            }
          }
        }
        .el-icon-search:before {
          cursor: pointer;
          display: inline-block;
        }
      }
    }
    .container {
      margin: px2rem(10);
      height: 86vh;
      padding: px2rem(20);
      .el-pagination {
        text-align: center;
        position: absolute;
        left: 50%;
        bottom: px2rem(20);
        transform: translateX(-50%);
      }
    }
  }
  .el-date-editor {
    width: px2rem(24);
    height: px2rem(24);
    margin-left: px2rem(-20);
    margin-right: px2rem(20);
    /deep/ .el-input__inner {
      display: none;
      padding: 0;
    }
    /deep/ .el-input__prefix {
      width: px2rem(20);
      height: px2rem(20);
      display: inline-block;
    }
    /deep/ .el-icon-date:before {
      position: absolute;
      margin-left: px2rem(-10);
      margin-top: px2rem(-10);
    }
    /deep/ .el-input__suffix {
      display: none;
    }
  }
}
</style>
