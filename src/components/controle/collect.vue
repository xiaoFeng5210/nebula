<template>
  <div class="complete bg-white">
    <el-container>
      <el-header class="d-flex jc-between ai-center">
        <div>
          <el-button type="primary" plain class="el-icon-delete" @click="cancelCollect">取消收藏</el-button>
          <el-button type="primary" @click="openFile">打开所在文件夹</el-button>
        </div>
        <div class="d-flex jc-between ai-center">
          <el-dropdown @command="handleCommand">
            <el-button>标签筛选</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in allTags" :key="index" :command="{item}">
                <span>{{item.tagName}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-input placeholder="请输入文件名" @keyup.enter.native="keyWordsSearch" v-model="content">
            <i slot="prefix" class="el-input__icon el-icon-search" @click="keyWordsSearch"></i>
          </el-input>
          <div class="right-tag d-flex jc-between ai-center">
            <el-button class="el-icon-sort" @click="isTable=true"></el-button>
            <el-button class="el-icon-menu" @click="isTable=false"></el-button>
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="header d-flex jc-between ai-center">
          <div class="d-flex jc-between ai-center">
            <div class="tags">
              <div @click="backPreviousLevel">返回上一级</div>
            </div>
            <div class="lines"></div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item v-for="(item, index) in navBarFileLevels" :key="index">
                <span :class="{ nav__title: item.current }">{{item.title}}</span>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div>已全部加载，共 {{total}} 个</div>
        </div>
        <listable
          ref="listable"
          :tableData="tableData"
          v-show="isTable"
          @get-data="getListData"
          @showupbox="clickUpbox"
          @cd-directory="handleCdDirectory"
          @delete-ids="handleDeleteList"
        ></listable>
        <listfile :datas="tableData" @showupbox="clickUpbox" v-show="!isTable"></listfile>
      </el-main>
    </el-container>
    <div id="upbox" ref="upbox">
      <el-link @click="cancelCurrent">取消收藏</el-link>
      <el-link @click="openRowfile">打开所在文件夹</el-link>
      <el-link @click="upboxCancel">取消</el-link>
    </div>
  </div>
</template>
<script>
import listable from './listTable';
import listfile from './listFile';
import {
  collectList,
  getAllTagsClient,
  tagFilter,
  fileSearch,
  downFile,
  deleteListClient,
  searchChildren,
  batchCancel,
  getDatumListClient
} from '@/api/datumInterface';
export default {
  name: 'collect',
  components: {
    listable,
    listfile
  },
  data() {
    return {
      checkedId: '',
      fileIds: [],
      listRows: [],
      ids: [],
      parentId: '-1',
      currentFileName: '', // 当前层级的文件名
      previousParentId: [], // 记录上一层级
      navBarFileLevels: [{ current: true, title: '个人收藏' }],
      total: '', // 收藏数量
      isTable: true, // 控制个人收藏页：标签的显示隐藏
      projectId: localStorage.getItem('projectId'), // 项目id
      content: '', // 搜索文件名
      tableData: [], //
      tableRowDetail: {},
      allTags: [
        {
          tagName: '所有',
          id: '-1'
        }
      ]
    };
  },
  mounted() {
    this.getListData();
    this.getAllTags();
  },
  methods: {
    // 获取收藏列表
    getListData() {
      collectList({ projectId: this.projectId }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    // 标签筛选
    handleCommand(command) {
      if (command.item.id === '-1') {
        return this.getListData();
      }
      const data = { tagIds: [command.item.id], projectId: this.projectId };
      tagFilter(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
        }
      });
    },
    // 获取当前项目下所有标签
    getAllTags() {
      const data = { projectId: this.projectId };
      getAllTagsClient(data).then(res => {
        if (res.code === 200) {
          this.allTags = this.allTags.concat(res.data.list);
        } else {
          return this.$message.error(res.message);
        }
      });
    },
    // 查找每一层文件夹
    getChildren() {
      searchChildren({
        projectId: this.projectId,
        parentId: this.parentId
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
        }
      });
    },
    // 进入下一层级目录
    handleCdDirectory(val) {
      // 首先记录上一层级的parentId
      this.previousParentId.push(this.parentId);
      // 记录当前层级的文件名
      this.currentFileName = val.fileName;
      this.navBarFileLevels[this.navBarFileLevels.length - 1].current = false;
      this.navBarFileLevels.push({
        current: true,
        title: this.currentFileName
      });
      // 记录当前层级
      this.parentId = val.id;
      this.getChildren();
    },
    // 返回上一级
    backPreviousLevel() {
      if (this.navBarFileLevels.length >= 2) {
        this.navBarFileLevels.pop();
        this.navBarFileLevels[this.navBarFileLevels.length - 1].current = true;
        this.parentId = this.previousParentId[this.previousParentId.length - 1];
        this.previousParentId.pop();
        this.getChildren();
      }
    },
    // 鼠标右击提示可用操作栏
    clickUpbox(val) {
      // list组件传过来的数据（val.row为本条表格点击的信息，val.ev为鼠标点击表格点击事件所有的参数）
      this.tableRowDetail = val;
      this.currentFileName = this.tableRowDetail.row
        ? this.tableRowDetail.row.fileName
        : '';
      const upbox = document.getElementById('upbox');
      window.upbox = upbox;
      const clientW = document.body.clientWidth;
      const clientH = document.body.clientHeight;
      if (val) {
        // const rowVal = val.row;
        const eventVal = val.ev;
        const viewsW = eventVal.clientX;
        const viewsH = eventVal.clientY;
        upbox.style.display = 'block';
        const boxW = upbox.clientWidth;
        const boxH = upbox.clientHeight;
        // 表格鼠标右键自定义弹出框的适应（优化可能）
        if (clientW - viewsW >= boxW && clientH - viewsH >= boxH) {
          upbox.style.left = viewsW + 'px';
          upbox.style.top = viewsH - 120 + 'px';
        } else if (clientW - viewsW < boxW && clientH - viewsH >= boxH) {
          upbox.style.left = viewsW - boxW - 20 + 'px';
          upbox.style.top = viewsH - 120 + 'px';
        } else if (clientW - viewsW >= boxW && clientH - viewsH < boxH) {
          upbox.style.left = viewsW + 'px';
          upbox.style.top = viewsH - 120 - boxH + 'px';
        } else if (clientW - viewsW < boxW && clientH - viewsH < boxH) {
          upbox.style.left = viewsW - boxW - 20 + 'px';
          upbox.style.top = viewsH - 120 - boxH + 'px';
        }
      } else {
        upbox.style.display = 'none';
      }
    },
    // 取消右击事件
    upboxCancel() {
      this.$refs.upbox.style.display = 'none';
    },
    // 下载
    downloadFile() {},
    // 获得要选中的列表项
    handleDeleteList(val) {
      this.listRows = val;
      this.listRows.forEach((v, i) => {
        this.fileIds[i] = v.id;
      });
      const fileStr = this.fileIds.join();
      this.checkedId = fileStr;
    },
    cancelCurrent() {
      this.$confirm('取消收藏将不在此页面显示，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { fileIds: [this.tableRowDetail.row.id] };
        this.handleCancel(data);
      });
    },
    // 批量取消收藏
    cancelCollect() {
      this.$confirm('取消收藏将不在此页面显示，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.listRows.forEach((v, i) => {
            this.fileIds[i] = v.id;
          });
          const data = { fileIds: this.fileIds };
          this.handleCancel(data);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
    },
    // 取消收藏接口
    handleCancel(data) {
      batchCancel(data).then(res => {
        if (res.code === 200) {
          this.$message.success('取消收藏成功');
          this.getListData();
        } else {
          return this.$message.error(res.message);
        }
      });
    },
    // 打开所在文件夹
    openFile() {
      this.$router.push({
        path: '/complete',
        query: {
          parentId: this.checkedId
        }
      });
    },
    openRowfile() {
      this.$router.push({
        path: '/complete',
        query: {
          parentId: this.tableRowDetail.row.parentId
        }
      });
    },
    // 根据文件名搜索
    keyWordsSearch() {
      fileSearch({
        projectId: this.projectId,
        content: this.content
      }).then(res => {
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.nav__title {
  cursor: pointer;
  color: $bluebor;
}
.complete {
  position: relative;
  width: 100%;
  height: 100%;
  #upbox {
    z-index: 999;
    width: auto;
    height: auto;
    padding: 10px 26px;
    background: #ccc;
    display: none;
    position: absolute;
    .el-link {
      display: block;
      line-height: 32px;
    }
  }
  .el-header {
    border-bottom: px2rem(1) solid $bors;
    .el-button {
      padding: px2rem(10) px2rem(20);
    }
    .el-button::before {
      width: px2rem(44);
      margin-right: px2rem(8);
    }
    .el-input {
      margin: 0 px2rem(10);
      padding: 0 px2rem(10);
      /deep/ .el-input__inner {
        height: px2rem(38);
        line-height: px2rem(38);
      }
      /deep/ .el-input__prefix {
        position: absolute;
        height: 100%;
        left: px2rem(10);
        top: px2rem(-4);
      }
      /deep/ .el-input__prefix:hover {
        cursor: pointer;
      }
    }
    .right-tag {
      width: px2rem(120);
      height: px2rem(34);
      line-height: px2rem(34);
      .el-button {
        padding: px2rem(10) px2rem(15);
      }
    }
  }

  .el-main {
    padding: 0;
    .header {
      height: px2rem(60);
      line-height: px2rem(60);
      font-size: px2rem(13);
      color: $selfTitle;
      padding: 0 px2rem(20);
      border-bottom: px2rem(1) solid $bors;
      .tags {
        width: px2rem(80);
        cursor: pointer;
      }
      .lines {
        width: px2rem(1);
        height: px2rem(20);
        margin: 0 px2rem(10);
        background: $bors;
      }
      .line {
        width: px2rem(14);
        height: px2rem(1);
        margin: 0 px2rem(10);
        background: $bors;
      }
    }
    .table {
      padding: 0 px2rem(20);
    }
  }
}
</style>
