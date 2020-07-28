<template>
  <!-- 简约模式 -->
  <div class="tagbox" v-if="listType === false" ref="tagbox">
    <el-row class="marginbtm">
      <el-row class="alignleft textweight marginbtm">
        <el-col :span="22" class="alignleft textweight">标记管理</el-col>
        <el-col :span="2"><i class="el-icon-close icon__close" style="cursor: pointer" @click="closeTagBox"></i></el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="alignleft">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleCreateBadge">新建标记</el-button>
        </el-col>
        <el-col :span="12" class="alignright">
          <el-button class="el-icon-s-unfold" type="primary" size="mini" @click="listView(1)">列表视图</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-form :inline="true" :model="formInline" class="demo-form-inline rowline">
            <el-form-item>
              <el-row>
                <el-col :span="5">类型:</el-col>
                <el-col :span="19">
                  <el-select v-model="formInline.region" placeholder="请输入标记类型" style="width: 145px; margin-left: 8px;">
                    <el-option label="安全问题" value="shanghai"></el-option>
                    <!--                  <el-option label="区域二" value="beijing"></el-option>-->
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-row>
                <el-col :span="5">日期:</el-col>
                <el-col :span="19">
                  <el-date-picker style="margin-left: 8px; width: 150px;" v-model="formInline.date" type="date" placeholder="选择日期"></el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
        </el-form>
        <div style="display: inline-flex;">
          <el-input v-model="formInline.name" placeholder="请输入标记名称" style="width: 230px;">
<!--             <i slot="prefix" class="el-input__icon el-icon-search"></i>-->
          </el-input>
<!--          <el-button type="primary" size="mini" style="margin-left: 20px;" @click="queryList">查询</el-button>-->
        </div>
      </el-row>
    </el-row>
    <div class="content" ref="content" @scroll="listScroll">
      <el-row>
        <el-row :class="items.isact?'item active':'item'" v-for="(items, index) in datalist" :key="items.id">
          <el-row>
            <el-col :span="5"><div style="font-size: 11px;">创建人:</div></el-col>
            <el-col :span="6"><span style="font-size: 11px; font-weight:400;">{{items.name}}</span></el-col>
            <el-col :span="13"><span style="font-size: 11px; white-space:nowrap;">{{items.createTime}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><span style="font-size: 11px;">标记名称:</span></el-col>
            <el-col :span="18"><span style="font-size: 11px; font-weight:400;">{{items.name}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><span style="font-size: 11px;">标记描述:</span></el-col>
            <el-col :span="18"><span style="font-size: 11px; font-weight:400;">{{items.description}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><span style="font-size: 11px;">位置描述:</span></el-col>
            <el-col :span="10"><span style="font-size: 11px; font-weight:400;">{{items.location}}</span></el-col>
            <el-col :span="2">
              <i class="el-icon-location-information"
                 style="color: blue; cursor: pointer" @click="positionScene(items.buildId)"></i>
            </el-col>
            <el-col :span="6"><span class="details__text" @click="seeDetailsFromConcise(items)">查看详情</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="block">
              <el-image :src="baseViewportSrc + items.viewport" style="width:100%"></el-image>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-input v-model="dicussContent[index]"></el-input>
            </el-col>
            <el-col :span="3">
              <el-link type="primary" @click="sendDiscuss(items.id, index)" style="font-size: 11px;">发送</el-link>
            </el-col>
            <el-col :span="6">
              <el-link type="info" @click="getDiscussData(items.id, index)" style="font-size: 11px;">评论({{items.count}})</el-link>
            </el-col>
          </el-row>
          <!--        <el-col v-for="son in items.comments" :key="son">-->
          <!--          <span class="disblock">{{son.name+":"+son.com}}</span>-->
          <!--        </el-col>-->
          <el-col>
            <div class="discuss__list" v-for="(item, index) in items.bbsList" :key="index">
              <div class="disblock">
                <div class="disblock__name">{{item.createUserName}}</div>
                <div class="disblock__date" style="font-size: 11px;">{{item.createTime}}</div>
              </div>
              <div class="disblock__content">
                <div class="content__title" style="font-size: 11px;">{{item.content}}</div>
                <!--              <el-button class="delete__discuss" size="mini" @click="deleteDiscuss(items.id)">删除</el-button>-->
                <div><span class="delete__discuss" @click="deleteSimpleDiscuss(items.id, item.id)" style="font-size: 11px;">
                删除</span>
                </div>
              </div>
              <el-button type="text" :loading="discussMoreLoading"
                         @click="getAllDiscuss(items.id, index)" v-if="index === moreButtonVisible">加载更多</el-button>
            </div>
          </el-col>
        </el-row>
      </el-row>
    </div>
    <CreateNewBadge :dialogVisible="isCreateBadgeVisible" :buildId="listParams.buildId" :pos="pos" :viewport="viewport"
                    :count="count" v-if="isCreateBadgeVisible" @close-modal="handleClose"
                    @remove-event="removeEventBadge" @add-count="addCount"/>
  </div>
<!--  列表模式-->
  <div v-else class="simple">
    <el-container>
      <el-header class="bg-white">
        <el-row>
          <el-col :span="4" class="self-title">
            <i class="bg-primary"></i>
            {{listTitle}}
          </el-col>
          <el-col :span="6"></el-col>
          <el-col :span="9">
            <div class="button__group" v-if="!isBadgeDetailsVisible">
              <div class="select">
                <el-select v-model="formInline.type" placeholder="类型筛选" @change="partakeChange">
                  <el-option
                    v-for="item in typeFilterOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="select">
                <el-select v-model="formInline.day" placeholder="全部">
                  <el-option
                    v-for="item in recentDays"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div>
                <el-button size="small" class="deleteBtn"
                           @click="handleDeleteItem" :loading="buttonLoading">删除</el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="3" class="text-center" v-if="!isBadgeDetailsVisible">
            <el-input placeholder="请输入标记名称" v-model="formInline.name">
              <i @click="queryList" slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-col :span="2" class="text-center" v-if="!isBadgeDetailsVisible">
            <el-button type="primary" size="mini" @click="listView(2)">切换至简约模式</el-button>
          </el-col>
          <el-col :span="2" class="text-center">
            <el-button type="primary" size="mini" @click="backingOut">返回</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div class="view_box d-flex jc-start">
          <div class="view__list" v-if="!isBadgeDetailsVisible">
            <div class="view__list__item" v-for="(item, index) in datalist" :key="index">
              <div class="list__checkbox">
                <el-checkbox  v-model="checkbox[index]"></el-checkbox>
              </div>
              <div class="list__img">
                <img :src="baseViewportSrc + item.viewport" alt="">
              </div>
              <div class="list__right" @click="handleSeeDetails(item.id, item)">
                <div class="list__title">{{item.name}}</div>
                <div class="list__content">{{item.description}}</div>
                <div class="list__bottom">
                  <span>创建日期：{{item.createTime}}</span><span class="bottom__inner">创建人：{{item.createUserName}}</span><span class="bottom__inner">评论（{{item.count}}）</span>
                </div>
              </div>
            </div>
          </div>
          <BadgeDetails v-if="isBadgeDetailsVisible"
                        :sceneId="sceneId" :badgeDetail="badgeDetail"
                        :discussTotal="discussTotal" @opposite-direction="handleSeeBuildId"/>
        </div>
        <el-pagination v-if="!isBadgeDetailsVisible"
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="currentChange"
          :page-size="listParams.size"
          :current-page="listParams.page"
        ></el-pagination>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { getSceneBadgeList, deleteListItem, httpAddDiscuss, getDiscussList, deleteDiscuss } from '@/api/tagboxApi/tagboxApi';
import CreateNewBadge from './createNewBadge';
import BadgeDetails from './badgeDetails';
import base64IMg from '@/utils/aes'; // 引入js将base64图片转文件形式
import { upload } from '@/api/user';

export default {
  name: 'tagbox',
  components: {
    CreateNewBadge,
    BadgeDetails
  },
  data() {
    return {
      typeFilterOption: [
        {
          value: '2',
          label: '我参与的'
        },
        {
          value: '1',
          label: '我创建的'
        }
      ],
      recentDays: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 3,
          label: '最近三天'
        },
        {
          value: 7,
          label: '最近七天'
        }
      ],
      count: 1,
      baseViewportSrc: 'api/bjfiles/filesFilter/',
      viewport: '1',
      companyId: localStorage.getItem('companyId'),
      // 评论总数
      discussTotal: '',
      moreButtonVisible: '',
      // 加载更多
      discussMoreLoading: false,
      // 判断从简约模式还是从列表模式跳到详情页的
      isBackingOutFromSketchy: true,
      badgeDetail: '',
      dicussContent: [],
      // 主贴id
      sceneId: '',
      checkbox: [false, false, false, false, false, false],
      // 列表页title
      listTitle: '标记管理',
      // 详情页展示
      isBadgeDetailsVisible: false,
      ids: [],
      // 删除按钮loading
      buttonLoading: false,
      isCreateBadgeVisible: false,
      listType: false, // 切换列表模式和简约模式
      // 当前页
      currentPage: 1,
      // 总条数
      total: 0,
      // 选中的构件的位置
      pos: [],
      // 简约模式下的page页
      simpleListParams: {
        projectId: localStorage.getItem('projectId'),
        buildId: '', // 构件ID
        modelId: '',
        page: 1,
        size: 10
      },
      listParams: {
        buildId: '', // 构件ID
        modelId: '',
        page: 1,
        size: 6
      },
      formInline: {
        createTime: '',
        type: '',
        // 标记名称
        name: '',
        day: null
      },
      // 主要列表数据
      datalist: []
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.$nextTick(() => {
      document.addEventListener('RealBIMSelShape', this.showBubble);
    });
  },
  watch: {
  },
  methods: {
    init() {
      // 获取当前项目ID
      // const currentProjectId = window.localStorage.getItem('currentProjectId');
      const projectId = localStorage.getItem('projectId');
      const data = { projectId: projectId };
      const paramsData = Object.assign(data, this.listParams);
      this.getListData(paramsData);
    },
    // 鼠标滚动事件
    listScroll() {
      const scrollTop = this.$refs.content.scrollTop;
      const clientHeight = this.$refs.content.clientHeight;
      const scrollHeight = this.$refs.content.scrollHeight;
      if (scrollTop + clientHeight >= scrollHeight) {
        const data = { ...this.simpleListParams };
        this.getListData(data);
        this.simpleListParams.size = this.simpleListParams.size + 10;
      }
    },
    // 类型变化时列表刷新
    partakeChange(val) {
      if (val) { this.queryList(); }
    },
    // 查询
    queryList() {
      const currentProjectId = localStorage.getItem('projectId');
      const data = { projectId: currentProjectId };
      const paramsData = Object.assign(data, this.listParams);
      const queryData = Object.assign(paramsData, this.formInline);
      this.getListData(queryData);
    },
    // 请求列表数据
    getListData(data) {
      getSceneBadgeList(data).then(res => {
        if (res.code === 200) {
          this.datalist = res.data.list;
          this.total = res.data.total;
          this.datalist.forEach((item) => {
            item.checked = false;
          });
        }
      });
    },
    // 获取矢量元素的点击事件
    showBubble() {
      const anchorInfo = REgetCurShpProbeRet();
      const str = anchorInfo.m_strSelShpObjName.slice(2);
      console.log(str);
    },
    // 获取评论列表
    getDiscussData(id, index) {
      this.moreButtonVisible = index;
      const data = {
        type: 2,
        sceneId: id,
        page: 1,
        size: 10
      };
      getDiscussList(data).then(res => {
        if (res.code === 200) {
          const addList = res.data;
          this.datalist[index].bbsList = addList;
        }
      });
    },
    getAllDiscuss(id, index) {
      this.moreButtonVisible = index;
      this.discussMoreLoading = true;
      const data = {
        type: 2,
        sceneId: id,
        page: 1,
        size: 100
      };
      getDiscussList(data).then(res => {
        if (res.code === 200) {
          this.discussMoreLoading = false;
          this.moreButtonVisible = -1;
        }
      });
    },
    // 定位
    positionScene(buildId) {
      this.focusCamTo(buildId);
    },
    // 查看详情从简约模式中
    seeDetailsFromConcise(current) {
      this.listType = true;
      this.sceneId = current.id;
      this.discussTotal = current.count;
      this.badgeDetail = current;
      this.$emit('showList', 1);
      this.isBadgeDetailsVisible = true;
      // 简约模式查看详情
      this.isBackingOutFromSketchy = true;
      this.listTitle = '标记名称';
    },
    // 查看详情
    handleSeeDetails(id, item) {
      this.sceneId = id;
      this.badgeDetail = item;
      this.discussTotal = item.count;
      this.isBadgeDetailsVisible = true;
      // 从列表页跳到详情页
      this.isBackingOutFromSketchy = false;
      this.listTitle = '标记名称';
    },
    // 切换列表模式
    listView(num) {
      this.listType = num === 1;
      this.$emit('showList', num);
      this.listTitle = '标记名称';
      this.listParams.size = 6;
      this.queryList();
      this.isBadgeDetailsVisible = false;
    },
    // 从详情页返回
    backingOut() {
      if (this.isBackingOutFromSketchy) {
        this.listView(2);
      } else {
        this.isBadgeDetailsVisible = false;
        this.listType = true;
      }
    },
    handleCreateBadge() {
      document.getElementsByTagName('canvas')[2].addEventListener('mousemove', e => {
        document.getElementsByTagName('canvas')[2].style.cursor = 'crosshair';
      });
      document.addEventListener('RealBIMSelModel', this.getCurrentProject);
      this.uploadViewport();
    },
    // 先截取模型图片再上传
    uploadViewport() {
      const base64Data = REgetScreenPrintImage();
      const blob = base64IMg.base64ToBlob(base64Data);
      var formdata = new FormData();
      formdata.append('companyId', this.companyId);
      formdata.append('file', blob);
      // 获取视口图片的地址
      upload(formdata).then(res => {
        if (res.code === 200) {
          this.viewport = res.data.fileId;
        }
      });
    },
    // 点击事件监听函数
    getCurrentProject() {
      const project = REgetCurProbeRet(); // 获取当前选中点相关参数
      this.listParams.buildId = project.m_uSelActorSubID_L32;
      this.pos = project.m_vSelCenter;
      if (this.listParams.buildId) {
        this.isCreateBadgeVisible = true;
      }
    },
    // 删除列表项
    handleDeleteItem() {
      this.checkbox.forEach((v, i) => {
        if (v === true) {
          this.ids.push(this.datalist[i].id);
        }
      });
      const data = { ids: this.ids };
      deleteListItem(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.checkbox = [false, false, false, false, false, false];
        } else {
          return this.$message.error(res.message);
        }
      }).catch(err => {
        return this.$message.error(err.message);
      }).finally(() => {
        this.init();
      });
    },
    sendDiscuss(id, index) {
      const url = window.location.href;
      const content = this.dicussContent[index];
      const projectId = localStorage.getItem('projectId');
      const place = 'xiaofeng';
      const type = 2;
      const sceneId = id;
      const data = { url, content, projectId, place, type, sceneId };
      httpAddDiscuss(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.queryList();
        } else {
          return this.$message.error(res.message);
        }
      }).catch(err => {
        return this.$message.error(err.message);
      });
    },
    deleteSimpleDiscuss(sceneId, id) {
      const data = { sceneId, id };
      deleteDiscuss(data).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.queryList();
        }
      });
    },
    handleClose() {
      this.listParams.buildId = '';
      setTimeout(() => {
        this.init();
      }, 500);
      this.isCreateBadgeVisible = false;
    },
    // 分页导航
    currentChange(val) {
      this.currentPage = val;
      this.listParams.page = val;
      this.queryList();
    },
    // 关闭Modal框
    closeTagBox() {
      this.$emit('close-tagbox');
    },
    // 相机定位到构件ID集合
    focusCamTo(buildId) {
      const objArr = [buildId];
      const backDepth = 2.0;
      REfocusCamTo(objArr, backDepth);
    },
    // 反向查询构件
    handleSeeBuildId(buildId) {
      this.listType = false;
      this.$emit('showList', 2);
      this.focusCamTo(buildId);
    },
    // 删除事件
    removeEventBadge() {
      document.removeEventListener('RealBIMSelModel', this.getCurrentProject);
    },
    addCount() {
      this.count = this.count + 1;
    }
  },
  beforeDestroy() {
    REdelAllAnchors();
    window.sessionStorage.removeItem('badgeArray');
  }
};
</script>
<style lang="scss" scoped>
.discuss__list {
  margin-top: px2rem(5);
  /deep/ .el-button {
    margin-left: 50%;
    transform: translateX(-50%);
  }
}
.details__text {
  cursor: pointer;
  color: $bluebor;
  font-size: px2rem(11);
}
.content {
  /deep/ .el-link {
    margin-top: px2rem(8);
    margin-left: px2rem(3);
  }
}
.view__list__item {
  cursor: pointer;
  width: 137%;
  border-bottom: 1px solid $topsFont;
  padding-bottom: px2rem(16);
  margin-top: px2rem(20);
  display: flex;
  .list__checkbox {
    width: px2rem(62);
    margin-top: px2rem(38);
    text-align: center;
  }
  .list__img {
    width: px2rem(147);
    height: px2rem(104);
    margin-left: px2rem(15);
  }
  .list__right {
    margin-left: px2rem(25);
    .list__title {
      font-size:px2rem(20);
      font-family:Microsoft YaHei;
      font-weight:bold;
      line-height:px2rem(24);
    }
    .list__content {
      width: px2rem(1149);
      margin-top: px2rem(15);
    }
    .list__bottom {
      color: $topsFont;
      font-size:13px;
      font-weight:400;
      margin-top: px2rem(25);
      .bottom__inner {
        margin-left: px2rem(42);
        font-size: px2rem(11);
      }
    }
  }
}
.tagbox {
  // .tagbox {
  //   position: absolute;
  //   right: 0;
  //   top: px2rem(77);
  //   bottom: 0;
  //   width: px2rem(500);
  //   height: 100%;
  //   background: #eee;
  // }
  width: px2rem(332);
  height: 100%;
  position: absolute;
  right: 0;
  bottom: 0;
  /*top: px2rem(78);*/
  /*overflow: auto;*/
  z-index: 1000;
  background: $col;
  padding: px2rem(14) px2rem(14);
  padding-right: px2rem(5);
  box-sizing: border-box;
  font-size: px2rem(16);
  /deep/ .el-form-item {
    margin-bottom: 0 !important;
  }
  /deep/ .el-date-editor,
  .el-input--prefix,
  .el-input--suffix,
  .el-date-editor--date {
    width: px2rem(174) !important;
    // height: px2rem(30);
  }
  /deep/ .el-input__inner {
    height: px2rem(36);
  }
  /deep/ .el-icon-close {
  }
  .textweight {
    font-size: px2rem(14);
    font-weight: bold;
  }
  .marginbtm {
    margin-bottom: px2rem(16);
  }
  .alignleft {
    text-align: left;
  }
  .alignright {
    text-align: right;
  }
  // .rowline {
  //   margin-top: px2rem(10) !important;
  // }
  .item {
    box-sizing: border-box;
    padding: px2rem(20) px2rem(16) px2rem(0);
    background: #fff;
    margin-bottom: px2rem(16);
    .el-col {
      margin-bottom: px2rem(10);
    }
  }
  .active {
    border: 2px pink solid;
  }
  .content {
    overflow: scroll;
    height: px2rem(890);
    padding-bottom: px2rem(30);
  }
  .disblock {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
  }
  .disblock__content {
    margin-top: px2rem(10);
    display: flex;
    justify-content: space-between;
    padding-bottom: px2rem(6);
    border-bottom: 1px solid $topsFont;
    .delete__discuss {
      cursor: pointer;
      color: red;
    }
  }
  .discuss__more {
    cursor: pointer;
    text-align: center;
    margin-top: px2rem(5);
    color: $bluebor;
  }
}

.simple {
  width: 88%;
  .el-header {
    height: px2rem(60) !important;
    line-height: px2rem(60);
    margin-left: px2rem(2);
    padding: 0 px2rem(5);
    box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.1);
    .el-col {
      .button__group {
        display: flex;
        .select {
          margin-right: px2rem(8);
        }
      }
      padding: px2rem(1);
      i {
        width: px2rem(4);
        height: px2rem(18);
        margin: px2rem(-2) px2rem(10);
        display: inline-block;
      }
      .self-title {
        color: $selfTitle;
        font-size: px2rem(22);
      }
      .timeSpace {
        display: inline-block;
        margin: 0 px2rem(10);
        color: $selfTitle;
      }
      .deleteBtn {
        color: $absColor;
      }
    }
    /deep/ .el-input__inner {
      width: px2rem(215);
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
    height: 85vh;
    position: relative;
    background: #fff;
    margin-top: px2rem(10);
    margin-left: px2rem(2);
    padding: 0 px2rem(10);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    .view_box {
      overflow: hidden;
      margin: px2rem(20) px2rem(10);
      flex-wrap: wrap;
      align-content: flex-start;
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
