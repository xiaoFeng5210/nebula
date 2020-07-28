<template>
  <div class="table_page">
    <div class="content_title">
      <div class="content_top">
        <p class="welcome">秉匠科技，欢迎你！</p>
      </div>
      <div class="content_bottom d-flex jc-between">
        <div class="visit_detail">
          <div class="clearfix visit_box">
            <div class="left visit text-center text-grey">
              <p class="visit_num">{{visiteData.visited}}</p>
              <p class="text-left">项目访问</p>
            </div>
            <div class="left line">|</div>
            <div class="left visit text-center text-grey">
              <P class="visit_num">{{visiteData.rankA}}/{{visiteData.rankB}}</P>
              <P>团队内排名</P>
            </div>
            <div class="left line">|</div>
            <div class="left visit text-center text-grey">
              <p class="visit_num">{{visiteData.totalVisited}}</p>
              <p>项目总访问</p>
            </div>
          </div>
        </div>
        <div class="weather_detail">
          <nav>
            <a href="#">
              <img :src="weatherImg" class="weather" />
            </a>
            <a href="#">{{localweather.tem}}℃</a>
            <a href="#">{{localweather.wea}}</a>
            <a href="#">{{localweather.win}}</a>
            <a href="#">{{localweather.city}}</a>
          </nav>
        </div>
      </div>
    </div>
    <div class="content-box d-flex jc-between">
      <div class="backlog bg-white">
        <div class="backlog_nav d-flex jc-between">
          <div class="backlog_title">待办事项</div>
          <router-link to="/backlog" class="backlog_btn text-white text-center">更多</router-link>
        </div>
        <div class="backlog_list">
          <div class="backlog_list_each" v-for="(item, index) in backlogList" :key="index">
            <div class="each_box d-flex">
              <div class="each_left text-center">
                <img src="../assets/new.png" class="each_img" />
              </div>
              <div class="each_right flex-1">
                <div class="backlog_content text-dark lineOne">{{item.contentIndex}}</div>
                <div class="text-grey">{{item.createTime}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 暂无数据 -->
        <div class="noData text-center" v-if="backlogTotal<=0">
          <img src="../assets/worktable/noData.png" alt />
        </div>
      </div>
      <div class="backlog bg-white">
        <div class="backlog_nav d-flex jc-between">
          <div class="backlog_title">最新动态</div>
          <router-link to="/news" class="backlog_btn text-white text-center">更多</router-link>
        </div>
        <div class="backlog_list">
          <div class="backlog_list_each" v-for="(item, index) in newsList" :key="index">
            <div class="each_box d-flex">
              <div class="each_left text-center">
                <img src="../assets/new.png" alt class="each_img" />
              </div>
              <div class="each_right flex-1">
                <div class="backlog_content text-dark lineOne">{{item.contentIndex}}</div>
                <div class="text-grey">{{item.createTime}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 暂无数据 -->
        <div class="noData text-center" v-if="newsTotal<=0">
          <img src="../assets/worktable/noData.png" alt />
        </div>
      </div>
      <div class="backlog bg-white">
        <div class="backlog_nav d-flex jc-between">
          <div class="backlog_title">通知公告</div>
          <router-link to="/notice" class="backlog_btn text-white text-center">更多</router-link>
        </div>
        <div class="backlog_list">
          <div class="backlog_list_each" v-for="(item, index) in noticeList" :key="index">
            <div class="each_box d-flex">
              <div class="each_left text-center">
                <img src="../assets/voice.png" alt class="each_img voice_img" />
              </div>
              <div class="each_right flex-1">
                <div class="backlog_content text-dark lineOne">{{item.content}}</div>
                <div class="text-grey d-flex jc-between">
                  <div>{{item.createTime}}</div>
                  <div>附件数量：{{item.attachmentCount}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 暂无数据 -->
        <div class="noData text-center" v-if="noticeTotal<=0">
          <img src="../assets/worktable/noData.png" alt />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  projectVisited,
  worktableList,
  weather,
  getLocation
} from '@/api/workTable';
export default {
  name: 'tableMain',
  data() {
    return {
      cityId: '',
      backlogTotal: 0,
      newsTotal: 0,
      noticeTotal: 0,
      // 获取工作台请求参数
      listParams: {
        page: 1, // 页码
        size: 10, // 每页大小
        place: 1, // 工作台
        projectId: localStorage.getItem('projectId') // 项目id
      },
      backlogList: [], // 待办事项列表
      newsList: [], // 最新动态列表
      noticeList: [], // 通知公告列表
      // 获取项目访问量参数
      visitedParams: {
        projectId: localStorage.getItem('projectId') // 项目id
      },
      visiteData: {}, // 访问量数据
      localweather: {}, // 当地天气
      weatherImg: '', // 天气图片
      historyList: []
    };
  },
  methods: {
    // 获取当前位置
    getCity() {
      getLocation().then(res => {
        this.cityId = res.content.address_detail.city_code;
      });
    },
    // 获取天气
    getWeather() {
      weather({cityId:this.cityId}).then(res => {
        if (res.code === 200) {
          this.localweather = res.data;
          this.weatherImg =
            'http://tq.daodaoim.com//tianqiapi/skin/pitaya/' +
            res.data.weaImg +
            '.png';
        }
      });
    },
    // 获取访问量信息
    getprojectVisited() {
      projectVisited(this.visitedParams).then(res => {
        if (res.code === 200) {
          this.visiteData = res.data;
        }
      });
    },
    // 获取工作台列表
    getWorktableList() {
      worktableList(this.listParams).then(res => {
        if (res.code === 200) {
          this.backlogList = res.data.waitingMap.list;
          this.backlogTotal = res.data.waitingMap.total;
          this.newsList = res.data.latestMap.list;
          this.newsTotal = res.data.latestMap.total;
          this.noticeList = res.data.messageMap.list;
          this.noticeTotal = res.data.messageMap.total;
        }
      });
    }
  },
  mounted() {
    this.getWorktableList();
    this.getprojectVisited();
    this.getCity();
    this.getWeather();
  },
  computed: {
    msg() {
      return this.$store.getters.id;
    }
  },
  watch: {
    msg(val) {
      this.listParams.projectId = val;
      this.getWorktableList();
    }
  }
};
</script>
<style scoped lang="scss">
.table_page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .content_title {
    .content_top {
      margin-left: px2rem(37);
      margin-top: px2rem(15);
      .welcome {
        width: px2rem(234);
        height: px2rem(35);
        font-size: px2rem(26);
        margin: 0;
        padding: 0;
        color: $gre;
      }
    }
    .content_bottom {
      margin-left: px2rem(82);
      margin-right: px2rem(54);
      .visit_detail {
        .visit_box {
          .visit {
            width: px2rem(80);
            margin-right: px2rem(45);
            font-size: px2rem(16);
            .visit_num {
              color: $btn;
              font-weight: bold;
              font-size: px2rem(26);
              margin-top: px2rem(14);
              margin-bottom: px2rem(6);
            }
          }
          .line {
            position: relative;
            top: px2rem(30);
            right: px2rem(20);
          }
        }
      }
      .weather_detail {
        nav {
          a:not(:last-child) {
            margin-right: px2rem(32);
          }
          font-size: px2rem(16);
          color: $gre;
          a .weather {
            width: 37px;
            height: 37px;
            position: relative;
            top: 10px;
          }
        }
      }
    }
  }
  .content-box {
    margin: px2rem(20) px2rem(80);
    .backlog {
      width: 32%;
      height: 75vh;
      .backlog_nav {
        margin: px2rem(24);
        .backlog_title {
          width: px2rem(72);
          height: px2rem(24);
          font-size: px2rem(18);
          font-weight: bold;
          line-height: px2rem(24);
        }
        .backlog_btn {
          width: px2rem(70);
          height: px2rem(34);
          line-height: px2rem(34);
          border-radius: px2rem(4);
          background: rgba(55, 89, 160, 1);
          font-size: px2rem(13);
        }
      }
      .backlog_list {
        margin-top: px2rem(50);
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
            .voice_img {
              padding: px2rem(7);
            }
          }
          .each_right {
            font-size: px2rem(15);
            margin-right: px2rem(20);
            .backlog_content {
              margin-bottom: px2rem(12);
              .spanColor {
                color: $btnprim;
                text-decoration: underline !important;
              }
            }
          }
        }
      }
      .noData {
        margin-top: 50%;
      }
    }
  }
}
</style>
