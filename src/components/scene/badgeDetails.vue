<template>
    <div class="g__box">
      <div class="info bottom__line">
        <div class="info__title">基本信息</div>
        <div class="info__content">
          <div class="content__first content__margin">
            <span>标记名称：</span><span>{{badgeDetail.name}}</span>
          </div>
          <div class="info__second content__margin">
            <span>创建人：</span><span>{{badgeDetail.createUserName}}</span>
          </div>
          <div class="info__third content__margin">
            <span>创建时间：</span><span>{{badgeDetail.createTime}}</span>
          </div>
          <div class="info__foot content__margin">
            <span>位置描述：</span><span>{{badgeDetail.location}}</span>
          </div>
          <div class="info__five content__margin">
            <span>关联构件：</span><span style="margin-right: 20px;">构件名称</span>
            <span class="see__build" @click="seeBuildId">反查构件</span>
          </div>
        </div>
      </div>
<!--      标记视口-->
      <div class="badge__view bottom__line">
        <div class="info__title">标记视口</div>
        <div class="info__content img__style">
        </div>
      </div>
<!--      参与人-->
<!--      <div class="badge__view bottom__line">-->
<!--        <div class="info__title">参与人</div>-->
<!--        <div class="join__people">-->
<!--          <div class="join__content">-->
<!--            <div class="people__img"></div>-->
<!--            <div class="join__name"></div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      标记内容-->
      <div class="badge__view bottom__line">
        <div class="info__title">标记内容</div>
        <div class="badge__content">这是标记内容</div>
      </div>
<!--      评论-->
      <div class="discuss">
        <div class="info__title">评论（{{discussTotal}}）</div>
        <div class="discuss__content">
          <div class="discuss__input">
            <el-input
              v-model="content"
              type="textarea"
              placeholder="请输入内容"
              maxlength="30"
              show-word-limit
            ></el-input>
            <el-button type="primary" @click="sendDiscuss">发表</el-button>
          </div>
          <div class="discuss__user" v-for="(item, index) in discussList" :key="index">
            <div class="user__img"></div>
            <div class="user__info">
              <div>
                <div class="user__title">{{item.createUserName}}</div>
                <div class="user__content" style="margin-top: 15px;">{{item.content}}</div>
              </div>
              <div class="create__time">{{item.createTime}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { getDiscussList, httpAddDiscuss } from '@/api/tagboxApi/tagboxApi';
export default {
  name: 'badgeDetails',
  props: {
    // 传进来的scene, 属于主贴id
    sceneId: {
      type: String
    },
    badgeDetail: {
      type: Object
    },
    // 评论总数
    discussTotal: {
      type: Number
    }
  },
  data() {
    return {
      content: '',
      discussList: [],
      page: 1,
      size: 10,
      type: 2
    };
  },
  methods: {
    getList() {
      const data = {
        type: this.type,
        sceneId: this.sceneId,
        page: this.page,
        size: this.size
      };
      getDiscussList(data).then(res => {
        if (res.code === 200) {
          this.discussList = res.data.list;
        }
      });
    },
    sendDiscuss() {
      const url = window.location.href;
      const content = this.content;
      const projectId = localStorage.getItem('projectId');
      const place = 'xiaofeng';
      const type = 2;
      const sceneId = this.sceneId;
      const data = { url, content, projectId, place, type, sceneId };
      httpAddDiscuss(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getList();
        } else {
          return this.$message.error(res.message);
        }
      }).catch(err => {
        return this.$message.error(err.message);
      });
    },
    seeBuildId() {
      this.$emit('opposite-direction', this.badgeDetail.buildId);
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped lang="scss">
.g__box {
  .discuss {
    overflow: auto;
    height: px2rem(250);
    margin-top: px2rem(20);
    .discuss__content {
      margin-left: px2rem(15);
      margin-top: px2rem(20);
      .discuss__input {
        margin-bottom: px2rem(25);
      }
      /deep/ .el-textarea {
        width: 50%;
      }
      /deep/ .el-button {
        transform: translateY(-9px);
        margin-left: px2rem(15);
      }
      .discuss__user {
        position: relative;
        width: 67%;
        .user__img {
          /*border: 1px solid red;*/
          width: px2rem(50);
          height: px2rem(50);
        }
        .user__info {
          display: flex;
          width: 75%;
          margin-left: px2rem(15);
          .create__time {
            position: absolute;
            left: px2rem(780);
          }
        }
      }
    }
  }
  .badge__view {
    margin-top: px2rem(20);
    padding-bottom: px2rem(20);
    .img__style {
      /*border: 1px solid red;*/
      width: px2rem(236);
      height: px2rem(137);
    }
    .join__people {
      display: flex;
      .join__content {
        margin-left: px2rem(15);
        margin-top: px2rem(20);
        display: flex;
        .people__img {
          /*border: 1px solid red;*/
          width: px2rem(50);
          height: px2rem(50);
        }
        .join__name {
          margin-left: px2rem(20);
          line-height: px2rem(50);
        }
      }
    }
    .badge__content {
      margin-left: px2rem(15);
      margin-top: px2rem(20);
    }
  }
  .bottom__line {
    width: px2rem(1900.93);
    border-bottom: 1px solid $topsFont;
  }
  .info__content {
    margin-left: px2rem(15);
    margin-top: px2rem(20);
    font-size:px2rem(14);
    font-weight:normal;
    color:rgba(82,90,93,1);
    .see__build {
      cursor: pointer;
      color: $bluebor;
    }
    .content__margin {
      margin-bottom: px2rem(15);
    }
  }
  .info__title {
    font-size:px2rem(16);
    font-family:Microsoft YaHei;
    font-weight:bold;
  }
}
</style>
