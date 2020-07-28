<template>
  <div class="Header bg-primary d-flex text-white">
    <div class="left_header d-flex" v-if="rowShow">
      <div class="left_log">
        <img src="../../assets/logo.png" alt />
      </div>
    </div>
    <div class="left_header d-flex" v-if="!rowShow">
      <div class="left_log">
        <router-link to="/projectlist">
          <img src="../../assets/logo.png" alt />
        </router-link>
      </div>
      <div class="right_icon" v-if="!hideInfo">
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="projectBox" v-if="!hideInfo">
        <div class="project_title" @click="showSearch">
          <div class="title">
            <span>{{this.$store.getters.projectName}}</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
        </div>
        <div class="searchBox" v-show="searchShow">
          <div class="input_box">
            <el-input v-model="searchValue" placeholder="查找项目">
              <i slot="prefix" class="el-input__icon el-icon-search" @click="searchProjects"></i>
            </el-input>
          </div>
          <div class="latest_box" v-if="total>0">
            <div class="latest" v-if="!clickIcon">最近浏览项目</div>
            <div
              class="latest_item d-flex"
              v-for="(item, index) in projectData"
              :key="index"
              @click="changeProject(item)"
            >
              <div class="picture">
                <img :src="basesrc+item.projectImg" alt />
              </div>
              <p class="latest_name">{{item.projectName}}</p>
            </div>
          </div>
          <div class="latest_box" v-else>
            <div class="none_box text-center">
              <img src="../../assets/none.png" alt />
            </div>
            <p class="text-center none_text">抱歉，没有找到该项目</p>
          </div>
        </div>
      </div>
    </div>
    <div class="center_header">
      <div class="tabBox d-flex" v-if="!rowShow">
        <div
          :class="['tabItem', { active: tabIndex == index }]"
          v-for="(items, index) in headerTab"
          :key="index"
          @click="toPath(index, items.path)"
        >
          <span>{{ items.tabTag }}</span>
        </div>
      </div>
    </div>
    <div class="right_header d-flex jc-end">
      <div class="addBox" v-if="!rowShow && !hideInfo">
        <el-dropdown @command="handleCommand" trigger="click">
          <img class="icons" src="../../assets/icon/add.png" />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="noticeDialog">新建公告</el-dropdown-item>
            <el-dropdown-item command="modelDialog">上传模型</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="newsBox" @click="showNews">
        <img class="icons" src="../../assets/icon/email.png" />
        <span class="reds text-center" v-if="newsTotal>0">{{newsTotal}}</span>
      </div>
      <div class="redactBox" v-if="!hideInfo && !rowShow" @click="handleCommand('/progress')">
        <img class="icons" src="../../assets/icon/redact.png" />
      </div>
      <div class="personBox">
        <img class="icons" src="../../assets/icon/people.png" />
      </div>
      <div class="choseBox">
        <el-dropdown @command="handleCommand" trigger="click">
          <span class="el-dropdown-link">
            秉匠科技
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="/selfCenter" v-if="!hideInfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="/firmManage" v-if="!hideInfo">企业管理</el-dropdown-item>
            <el-dropdown-item command="/downloadCenter" v-if="!hideInfo">下载中心</el-dropdown-item>
            <el-dropdown-item v-if="!hideInfo">邀请成员</el-dropdown-item>
            <el-dropdown-item command="changeDialog" v-if="!hideInfo && total > 0">切换企业</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 新建公告弹窗 -->
    <announce v-if="dialogNotice" ref="announce"></announce>
    <!-- 上传模型弹窗 -->
    <uploadModel v-if="dialogModel" ref="uploadModel"></uploadModel>
    <!-- 切换企业弹窗 -->
    <transform
      v-if="dialogEnterprise"
      @chageshow="chageshow"
      ref="transform"
      :company="companyList"
      :innitee="showCreate"
    ></transform>
    <!--    公共模型加载处-->
    <div class="models" style="width: 0px; height: 0px; visible:hidden">
      <engine id="model"></engine>
    </div>
    <!-- 消息通知弹窗 -->
    <message
      v-if="dialogNews"
      ref="message"
      :newsData="newsData"
      :messageData="messageData"
      :projectOption="projectOption"
      @handle-change="getProjectId"
      @search-news="getSearchVal"
      @read-all="allRead"
      @read-click="clickRead"
      @read-del="delRead"
      @select-ids="getIds"
      @tab-change="changeTab"
    ></message>
  </div>
</template>

<script>
import message from '@/components/comModule/message';
import uploadModel from '@/components/comModule/uploadModel';
import transform from '@/components/comModule/transform';
import announce from '@/components/comModule/announce';
import engine from '@/components/scene/engine';
import {
  historyProjectList,
  searchProject,
  worktableList,
  updateStatus,
  projectAll,
  listByType,
  newsCount
} from '@/api/workTable';
import { companyList, getRole, getRoleByStaff } from '@/api/global';
export default {
  name: 'Header',
  components: {
    message,
    uploadModel,
    transform,
    announce,
    engine
  },
  props: {
    site: Number,
    projectName: String,
    // 用来隐藏企业创建页面的一些logo
    hideInfo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      deptId: '-1',
      newsTotal: 0,
      userId: '2', // 用户id
      companyId: localStorage.getItem('companyId'), // 企业id
      currentCompany: false,
      showCreate: false, // 创建企业的显示隐藏
      due: false,
      total: '', // 个人所属企业总数
      companyList: [],
      basesrc: 'api/bjfiles/filesFilter/',
      clickIcon: false, // 是否触发点击事件
      searchShow: false, // 搜索框是否显示
      searchValue: '', // 搜索内容
      rowShow: true,
      currentProject: {
        projectName: '',
        projectId: localStorage.getItem('projectId')
      },
      headerTab: [
        { tabTag: '工作台', path: '/tableMain' },
        { tabTag: '场景', path: '/mainScene' },
        { tabTag: '资料', path: '/controller' },
        { tabTag: '设置', path: '/projectSetting' }
      ],
      projectData: [],
      tabIndex: 6,
      dialogNews: false, // 消息弹窗
      dialogEnterprise: false, // 切换企业弹窗
      dialogNotice: false, // 新建公告弹窗
      dialogModel: false, // 上传模型弹窗
      listParams: {
        page: 1, // 页码
        size: 10, // 每页大小
        place: 2, // 消息按钮
        projectId: '', // 项目id
        query: ''
      },
      typeQuery: {
        page: 1, // 页码
        size: 10, // 每页大小
        place: 2, // 消息按钮
        projectId: '', // 项目id
        query: '',
        type: ''
      },
      newsData: [], // 所有消息
      messageData: [], // 分类消息
      projectOption: [], // 当前企业下所有项目
      ids: [],
      listRows: [], // 选中的列表数据
      tab: ''
    };
  },
  mounted() {
    this.getdata();
    this.getData2();
    this.getCount();
    this.getNewsList();
    this.getAllProject();
    const that = this;
    if (this.hideInfo) {
      this.headerTab = [];
    }
    this.$nextTick(() => {
      if (this.$store.getters.id === 0) {
        this.rowShow = true;
      } else {
        this.rowShow = false;
      }
      that.tabIndex = that.$props.site;
    });
    this.getCompanyById();
  },
  methods: {
    getData2() {
      const formdata = new FormData();
      formdata.append('companyId', this.companyId);
      formdata.append('projectId', this.projectId);
      formdata.append('deptId', this.deptId);
      getRoleByStaff(formdata).then((res) => {
        if (res.code === 200) {
          this.staffData = res.data;
        }
      });
    },
    getdata() {
      const formdata = new FormData();
      formdata.append('companyId', this.companyId);
      getRole(formdata).then((res) => {
        if (res.code === 200) {
        }
      });
    },
    toPath(index, paths) {
      this.tabIndex = index;
      this.$router.push({ path: paths });
    },
    // 查找项目的显示隐藏
    showSearch() {
      this.searchShow = !this.searchShow;
      // 获取浏览历史列表
      historyProjectList({
        companyId: this.companyId
      }).then((res) => {
        if (res.code === 200) {
          this.projectData = res.data.list;
        }
      });
    },
    // 点击查找项目
    searchProjects() {
      this.clickIcon = true;
      searchProject({
        content: this.searchValue,
        companyId: this.companyId
      }).then((res) => {
        if (res.code === 200) {
          this.projectData = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    // 切换项目,跳转到其工作台
    changeProject(item) {
      this.$store.commit('changeName', item.projectName);
      this.$store.commit('changeId', item.id);
      this.$router.push({
        path: '/tableMain',
        query: {
          id: item.id,
          companyId: item.companyId,
          projectName: item.projectName
        }
      });
    },
    // 消息弹窗可见
    showNews() {
      this.dialogNews = true;
      this.$nextTick(() => {
        this.$refs.message.openNewsVisible();
      });
    },
    chageshow(item) {
      this.$store.commit('changeName', item.projectName);
      this.$store.commit('changeId', item.id);
      this.$router.push({ path: '/projectList' });
      this.rowShow = true;
      this.dialogEnterprise = false;
    },
    handleCommand(command) {
      if (command === 'logout') {
        const datas = {
          companyId: localStorage.getItem('companyId'),
          projectId: localStorage.getItem('projectId')
        };
        this.$store.dispatch('user/logout', datas);
      } else if (command === 'changeDialog') {
        // 显示切换企业弹窗
        this.dialogEnterprise = true;
        this.$nextTick(() => {
          this.$refs.transform.enterpriseVisible();
        });
      } else if (command === 'noticeDialog') {
        // 显示新建公告弹窗
        this.dialogNotice = true;
        this.$nextTick(() => {
          this.$refs.announce.announceVisible();
        });
      } else if (command === 'modelDialog') {
        // 显示上传模型弹窗
        this.dialogModel = true;
        this.$nextTick(() => {
          this.$refs.uploadModel.openModelVisible();
        });
      } else {
        this.$router.push({ path: command });
      }
    },
    // 获取企业列表判断切换企业是否显示
    getCompanyById() {
      companyList().then((res) => {
        if (res.code === 200) {
          if (res.data.total === 1) {
            this.$store.commit('changeName', res.data.list[0].companyName);
            this.$store.commit('changeId', res.data.list[0].id);
            localStorage.setItem('companyId', res.data.list[0].id);
          }
          this.total = res.data.total;
          this.companyList = res.data.list;
          // 获取当前时间毫秒
          const todayMS = new Date().getTime();
          this.companyList.forEach((item) => {
            // 判断企业是否过期
            const startTime = item.createTime.replace(
              new RegExp('-', 'gm'),
              '/'
            ); // 转换日期格式为 year/month/day
            const startMS = new Date(startTime).getTime(); // 转为毫秒
            const deadline = startMS + item.validDateNum * 24 * 60 * 60 * 1000;
            if (todayMS > deadline) {
              // 如果当前日期大于截止日期，已过期
              item.due = true;
            } else {
              item.due = false;
            }
            // 创建企业的显示隐藏
            if (item.createUserId === this.userId) {
              this.showCreate = false;
            } else {
              this.showCreate = true;
            }
            // 判断是否为当前企业
            if (item.id === this.companyId) {
              item.currentCompany = true;
            } else {
              item.currentCompany = false;
            }
          });
        }
      });
    },
    // 获取当前企业下所有项目
    getAllProject() {
      projectAll({ companyId: this.companyId }).then((res) => {
        if (res.code === 200) {
          this.groupList = res.data.groupList;
          this.singleList = res.data.singleList;
          const allList = this.groupList.concat(this.singleList);
          if (!allList) {
            return;
          }
          this.projectOption = allList.map((item) => {
            return Object.assign(
              {},
              { id: item.id, projectName: item.projectName }
            );
          });
        }
      });
    },
    // 获取全部消息
    getNewsList() {
      worktableList(this.listParams).then((res) => {
        if (res.code === 200) {
          this.newsData = res.data;
        }
      });
    },
    // 获取全部消息数量
    getCount() {
      newsCount().then((res) => {
        if (res.code === 200) {
          this.newsTotal = res.data;
        }
      });
    },
    // 根据项目筛选消息
    getProjectId(event) {
      if (this.tab === '全部' || this.tab === '') {
        this.listParams.projectId = event;
        this.getNewsList();
      } else if (this.tab === '公告消息') {
        console.log('222');
        this.typeQuery.projectId = event;
        const data = this.typeQuery;
        this.getNewsByType(data);
      }
    },
    // 根据关键字搜索消息
    getSearchVal(searchValue) {
      this.listParams.query = searchValue;
      this.getNewsList();
    },
    // 更新消息状态接口
    updateNews(data) {
      updateStatus(data).then((res) => {
        if (res.code === 200) {
          this.getNewsList();
        }
      });
    },
    // 全部已读
    allRead() {
      this.newsData.forEach((v, i) => {
        this.ids[i] = v.id;
      });
      const data = {
        type: 5,
        status: 2,
        ids: this.ids
      };
      this.updateNews(data);
    },
    // 已读
    clickRead() {
      this.listRows.forEach((v, i) => {
        this.ids[i] = v.id;
      });
      const data = {
        type: 5,
        status: 2,
        ids: this.ids
      };
      this.updateNews(data);
    },
    // 删除
    delRead() {
      this.listRows.forEach((v, i) => {
        this.ids[i] = v.id;
      });
      const data = {
        type: 5,
        status: 4,
        ids: this.ids
      };
      this.updateNews(data);
    },
    // 选中当前行，获取id
    getIds(rows) {
      this.listRows = rows;
    },
    // 切换tab获取不同类型消息列表
    changeTab(val) {
      this.tab = val.tab;
      this.typeQuery = val.queryData;
      const data = val.queryData;
      if (val.tab === 'first') {
        this.getNewsList();
      } else {
        this.getNewsByType(data);
      }
    },
    // 根据类型获取消息列表
    getNewsByType(data) {
      listByType(data).then((res) => {
        if (res.code === 200) {
          this.messageData = res.data.list;
        }
      });
    }
  },
  watch: {
    $route(to) {
      if (to.name !== 'projectlist' && to.name !== 'coming') {
        this.rowShow = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.Header {
  width: 100%;
  height: px2rem(77);
  position: relative;
  z-index: 1000;
  line-height: px2rem(77);
  padding: 0 px2rem(23);
  .left_header {
    width: 30%;
    .left_log {
      width: px2rem(118);
      height: px2rem(43);
      img {
        width: 100%;
        height: 100%;
        margin-top: px2rem(15);
      }
    }
    .right_icon {
      margin: 0 px2rem(20);
    }
    .projectBox {
      .project_title {
        cursor: pointer;
        .title {
          font-weight: bold;
          font-size: px2rem(20);
          span {
            display: inline-block;
            margin-right: px2rem(20);
          }
        }
      }
      .searchBox {
        margin-top: px2rem(11);
        padding: 0 px2rem(12);
        width: px2rem(265);
        height: px2rem(318);
        background: $bgColor;
        border-radius: px2rem(3);
        border: 1px solid rgba(255, 255, 255, 1);
        box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.08);
        .input_box {
          height: px2rem(34);
          /deep/.el-input {
            height: px2rem(34);
            /deep/.el-input__inner {
              height: px2rem(34);
              font-size: px2rem(12);
              color: $inputplace;
            }
            /deep/ .el-input__prefix:hover {
              cursor: pointer;
            }
          }
        }
        .latest_box {
          margin-top: px2rem(26);
          font-size: px2rem(12);
          color: $topsFont;
          height: px2rem(250);
          overflow-y: auto;
          .none_box {
            margin-top: px2rem(56);
          }
          .none_text {
            height: px2rem(17);
            line-height: px2rem(17);
          }
          .latest {
            height: px2rem(18);
            line-height: px2rem(18);
            margin: px2rem(37) 0 px2rem(10) 0;
          }
          .latest_item {
            height: px2rem(40);
            margin: px2rem(20) 0;
            .picture {
              width: px2rem(62);
              height: px2rem(40);
              margin-right: px2rem(18);
              img {
                width: 100%;
                height: 100%;
              }
            }
            .latest_name {
              height: px2rem(18);
              line-height: px2rem(18);
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .latest_name:hover {
              text-overflow: inherit;
              overflow: visible;
              white-space: pre-line;
            }
          }
        }
      }
    }
  }
  .center_header {
    width: 40%;
    .tabBox {
      width: px2rem(520);
      margin-left: 15%;
      .tabItem {
        cursor: pointer;
        width: px2rem(130);
        height: px2rem(77);
        text-align: center;
        font-size: px2rem(16);
      }
      .active {
        background-color: $active;
        color: $bgColor;
        font-weight: bold;
      }
    }
  }
  .right_header {
    flex: 1;
    padding-top: px2rem(7);
    .addBox {
      cursor: pointer;
      margin-right: px2rem(42);
      .icons {
        width: px2rem(30);
        height: pox2rem(30);
      }
    }
    .newsBox {
      margin-right: px2rem(42);
      cursor: pointer;
      position: relative;
      .icons {
        width: px2rem(30);
        height: pox2rem(30);
      }
      .reds {
        width: px2rem(18);
        height: px2rem(18);
        text-align: center;
        line-height: px2rem(16);
        font-size: px2rem(12);
        border-radius: 50%;
        background: $news;
        position: absolute;
        top: px2rem(14);
        transform: translate(px2rem(-10), 0);
      }
    }
    .redactBox {
      cursor: pointer;
      margin-right: px2rem(42);
      .icons {
        width: px2rem(30);
        height: pox2rem(30);
      }
    }
    .personBox {
      margin-right: px2rem(15);
      margin-top: px2rem(3);
      .icons {
        width: px2rem(33);
        height: pox2rem(33);
      }
    }
    .choseBox {
      margin-top: px2rem(-8);
      .el-dropdown {
        color: $bgColor;
        font-size: px2rem(16);
      }
      .el-dropdown-link {
        cursor: pointer;
      }
    }
  }
  .models {
    display: none;
  }
}
</style>
