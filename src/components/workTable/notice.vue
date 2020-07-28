<template>
  <div class="notice">
    <el-container>
      <el-header class="bg-white">
        <el-row>
          <el-col :span="4" class="self-title">
            <i class="bg-primary"></i>
            通知公告
          </el-col>
          <el-col :span="15"></el-col>
          <el-col :span="3" class="text-center">
            <el-input placeholder="搜索公告标题,公告内容" v-model="input">
              <i slot="prefix" class="el-input__icon el-icon-search" @click="searchNotice"></i>
            </el-input>
          </el-col>
          <el-col :span="2" class="text-center">
            <el-button type="primary" size="mini" @click="showNotice">发公告</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div class="backlog_list_each" v-for="(item, index) in noticeList" :key="index">
          <div class="each_box clearfix">
            <div class="each_left text-center left">
              <img src="../../assets/voice.png" class="each_img" />
            </div>
            <div class="each_center left">
              <div class="backlog_content text-dark lineOne">{{ item.noticeContent }}</div>
              <div class="text-grey d-flex content_creator">
                <div class="creator">创建人：{{ item.creator }}</div>
                <div class="attach_count">附件数量：{{ item.attachCount }}</div>
                <div class="omitBox">
                  <div @click="showEdit(index)" class="omitBtn">...</div>
                  <div v-show="activeIndex===index" class="editBtn bg-white">
                    <div class="recall">撤回</div>
                    <div class="resend">编辑再发送</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="each_right d-flex right jc-end">
              <div class="notice_detail">
                <router-link to="/noticeDetail">查看详情</router-link>
              </div>
              <div class="text-grey">{{ item.noticeTime }}</div>
            </div>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="currentChange"
          :page-size="noticeParams.size"
          :current-page="noticeParams.page"
        ></el-pagination>
      </el-main>
      <!-- 发公告弹窗 -->
      <announce v-if="dialogNotice" ref="announce"></announce>
    </el-container>
  </div>
</template>

<script>
import announce from '@/components/comModule/announce';
import {listByType} from '@/api/workTable';
export default {
  name: 'notice',
  components: {
    announce
  },
  data() {
    return {
      activeIndex: -1, // 初始化点击的索引值
      total: 0, // 总条数
      noticeParams: {
        page: 1, // 页码
        size: 10, // 每页大小
        place: 1, // 工作台
        type: 2, // 类型:2通知公告
        projectId: localStorage.getItem('projectId'), // 项目id
        query: '' // 关键字搜索
      },
      dialogImageUrl: '',
      dialogVisible: false,
      fileId: '',
      fileList: [],
      isActive: false,
      activeName: 'second',
      personList: [], // 新增公告人员
      dialogNotice: false, // 新建公告弹窗
      input: '',
      noticeList: []
    };
  },
  methods: {
    // 分页导航
    currentChange(val) {
      this.noticeParams.page = val;
      this.getNoticeList();
    },
    showNotice() {
      this.dialogNotice = true;
      this.$nextTick(() => {
        this.$refs.announce.announceVisible();
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 控制撤回编辑框的显示隐藏
    showEdit(index) {
      if (this.activeIndex == null) {
        this.activeIndex = index;
      } else {
        this.activeIndex = null;
      }
    },
    // 获取通知公告列表
    getNoticeList() {
      listByType(this.noticeParams).then(res => {
        if (res.code === 200) {
          this.noticeList = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    // 搜索公告
    searchNotice() {
      this.noticeParams.query = this.input;
      this.getNoticeList();
    }
  },
  mounted() {
    this.getNoticeList();
  }
};
</script>

<style lang="scss" scoped>
.notice {
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
    /deep/ .el-input__prefix {
      position: absolute;
      height: 100%;
      top: px2rem(8);
      left: 0;
    }
    /deep/ .el-input__prefix:hover {
      cursor: pointer;
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
        width: 8%;
        height: px2rem(49);
        margin-right: px2rem(16);
        .each_img {
          width: px2rem(45);
          height: px2rem(45);
          background: rgba(55, 89, 160, 1);
          border-radius: 50%;
          padding: px2rem(7);
        }
      }
      .each_center {
        width: 52%;
        .backlog_content {
          font-size: px2rem(15);
          margin-bottom: px2rem(14);
        }
        .content_creator {
          font-size: px2rem(14);
          color: $deepGre;
          .creator {
            margin-right: px2rem(38);
          }
          .attach_count {
            margin-right: px2rem(38);
          }
          .omitBox {
            position: relative;
            .editBtn {
              position: absolute;
              width: px2rem(111);
              height: px2rem(73);
              text-align: center;
              border: 1px solid rgba(255, 255, 255, 1);
              box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
              border-radius: 3px;
              .recall,
              .resend {
                height: px2rem(32);
                line-height: px2rem(32);
              }
            }
            .omitBtn:hover {
              cursor: pointer;
            }
          }
        }
      }
      .each_right {
        width: 30%;
        font-size: px2rem(15);
        margin-right: px2rem(46);
        .notice_detail > a {
          color: $font;
          border-bottom: 1px solid $font;
          margin-right: px2rem(55);
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
