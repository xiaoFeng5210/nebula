<template>
  <div class="news">
    <el-container>
      <el-header class="bg-white">
        <el-row>
          <el-col :span="4" class="self-title">
            <i class="bg-primary"></i>
            最新动态
          </el-col>
          <el-col :span="12"></el-col>
          <el-col :span="7" class="text-center">
            <el-date-picker v-model="newsParams.startValue" type="datetime" placeholder="开始时间" value-format="yyyy-MM-dd HH:mm:ss" style="width:40%"></el-date-picker>
            <span class="timeSpace" style="width:2%">-</span>
            <el-date-picker v-model="newsParams.endValue" type="datetime" placeholder="结束时间" style="width:40%"></el-date-picker>
          </el-col>
          <el-col :span="1" class="text-center">
            <el-button type="primary" size="mini" @click="searchBtn">筛选</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div class="backlog_list_each" v-for="(item,index) in newsList" :key='index'>
          <div class="each_box d-flex">
            <div class="each_left text-center">
              <img src='../../assets/new.png' class="each_img" />
            </div>
            <div class="each_right flex-1">
              <div class="backlog_content text-dark lineOne">{{item.newsContent}}</div>
              <div class="text-grey">{{item.newsTime}}</div>
            </div>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="currentChange"
          :page-size="newsParams.size"
          :current-page="newsParams.page"
        ></el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {listByType} from '@/api/workTable';
export default {
  name: 'news',
  data() {
    return {
      newsParams:{
        page: 1, // 页码
        size: 10, // 每页大小
        place: 1, // 工作台
        type: 3, // 类型: 3最新动态
        projectId: localStorage.getItem('projectId'), // 项目id
        startValue: '', // 开始日期
        endValue: '' // 结束日期
      },
      total:0, // 总条数
      newsList: []
    };
  },
  methods: {
    // 分页导航
    currentChange(val) {
      this.newsParams.page = val;
      this.getNewsList();
    },
    // 获取最新动态列表
    getNewsList() {
      listByType(this.newsParams).then(res => {
        if (res.code === 200) {
          this.newsList = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    // 筛选
    searchBtn() {
      this.getNewsList();
    }
  },
  mounted() {
    this.getNewsList();
  }
};
</script>

<style lang="scss" scoped>
.tablePage {
  .el-header {
    height: px2rem(60) !important;
    line-height: px2rem(60);
    margin-left: px2rem(10);
    padding: 0 px2rem(10);
    box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.1);
    .el-col {
      padding: px2rem(1);
      i {
        width: px2rem(4);
        height: px2rem(18);
        margin: px2rem(-2) px2rem(10);
        display: inline-block;
      }
      .self-title {
        color: $selfTitle;
        font-size: px2rem(18);
      }
      .timeSpace {
        display: inline-block;
        margin: 0 px2rem(10);
        color: $selfTitle;
      }
    }
    /deep/ .el-input__inner {
      height: px2rem(34);
      line-height: px2rem(34);
      font-size: px2rem(13);
    }
    /deep/ .el-icon-time:before {
      color: $btn;
    }
  }
  .el-main {
    height: 86vh;
    position: relative;
    background: #fff;
    margin: px2rem(10);
    padding: 0 px2rem(10);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    .backlog_list_each {
      margin: px2rem(25) px2rem(9);
      padding-bottom: px2rem(24);
      border-bottom: 1px solid rgba(153, 153, 153, 0.45);
      .each_left {
        width: px2rem(88);
        height: px2rem(49);
        margin-right: px2rem(16);
        .each_img {
          width: px2rem(45);
          height: px2rem(45);
          background: rgba(55, 89, 160, 1);
          border-radius: 50%;
        }
      }
      .each_right {
        font-size: px2rem(15);
        margin-right: px2rem(20);
        .backlog_content {
          margin-bottom: px2rem(12);
        }
      }
    }
    .el-pagination {
      text-align: center;
      position: absolute;
      left: 50%;
      bottom: px2rem(20);
      transform: translateX(-50%);
    }
  }
}
</style>
