<template>
  <div class="noticeDetail">
    <el-container>
      <el-header class="bg-white">
        <el-row>
          <el-col :span="24" class="self-title">
            <i class="bg-primary"></i>
            通知公告
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div class="notice_detail">
          <div class="detail_title">基本信息</div>
          <div class="detail_sender">
            <p>标题：{{noticeDetail.noticeContent}}</p>
            <p>发件人：{{noticeDetail.creator}}</p>
            <p>时间：{{noticeDetail.noticeTime}}</p>
          </div>
        </div>
        <div class="notice_detail">
          <div class="detail_title">会议内容</div>
          <p class="detail_sender">{{noticeDetail.detail}}</p>
        </div>
        <div class="notice_attach">
          <div class="detail_title">附件</div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'noticeDetail',
  data() {
    return {
      noticeDetail: {
        noticeContent: '秉匠科技',
        creator: '李四',
        noticeTime: '2020/5/27 10:32',
        detail:
          '这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容这是公告内容，这是公告内容，这是公告内容，这是公告内容，这是公告内容。',
        attachmentList: []
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.noticeDetail {
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
    }
  }
  .el-main {
    height: 86vh;
    position: relative;
    background: #fff;
    margin: px2rem(10);
    padding: 0 px2rem(10);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    .notice_detail {
      margin: px2rem(20) px2rem(10);
      border-bottom: 1px solid $selfbor;
      .detail_title {
        margin-left: px2rem(10);
        font-weight: bold;
        line-height: 21px;
        font-size: px2rem(16);
      }
      .detail_sender {
        width: 68%;
        margin-left: px2rem(40);
        margin-bottom:px2rem(20);
        font-size: px2rem(14);
        color: $garkGrey;
        line-height:px2rem(28);
      }
    }
    .notice_attach{
      margin: px2rem(20) px2rem(10);
      .detail_title {
        margin-left: px2rem(10);
        font-weight: bold;
        line-height: 21px;
        font-size: px2rem(16);
      }
    }
  }
}
</style>
