<template>
  <div class="complete bg-white">
    <el-container>
      <el-header class="d-flex jc-between ai-center">
        <div>
          <el-button
            type="primary"
            plain
            class="el-icon-folder-add"
            @click="handleAdd"
            style="margin-right: 10px;"
          >新建文件夹</el-button>
          <el-dropdown>
            <el-button type="primary" plain class="el-icon-upload2">上传</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-upload
                  class="upload"
                  :action="uploadUrl"
                  :headers="uploadHeader"
                  :data="uploadParams"
                  :before-upload="beforeUploadCurrentDirectory"
                  :on-success="onsuccess"
                  :on-progress="uploadProgress"
                  :on-error="onError"
                  :show-file-list="false"
                >上传文件</el-upload>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-upload
                  class="upload"
                  action="api/upload"
                  accept=".jpg, .pdf, .png, .jpeg"
                  :on-success="onsuccess"
                  :show-file-list="false"
                >上传文件夹</el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
<!--          <el-button type="primary" plain class="el-icon-download" @click="downloadFile" style="margin-left: 10px;">下载</el-button>-->
          <el-button type="primary" plain class="el-icon-delete"
                     @click="handleDeleteGlobal" style="margin-left: 10px;" v-if="listRows.length > 0">删除</el-button>
<!--          <el-button type="primary" plain class="el-icon-edit" @click="rename">重命名</el-button>-->
          <el-button type="primary" plain class="el-icon-document-copy" v-if="listRows.length > 0" @click="copyCurrent">复制到</el-button>
          <el-button type="primary" plain class="el-icon-rank" v-if="listRows.length > 0" @click="currentMoveTo">移动到</el-button>
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
          <el-input placeholder="请输入关键字" icon="el-icon-search" v-model="tableQuery.content"></el-input>
          <div class="right-tag d-flex jc-between ai-center">
            <el-button class="el-icon-sort" @click="isTable=true"></el-button>
            <el-button class="el-icon-menu" @click="isTable=false"></el-button>
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="header d-flex jc-between ai-center">
          <div class="d-flex jc-between ai-center">
            <div class="tags" @click="backPreviousLevel" style="cursor: pointer;">返回上一级</div>
            <div class="lines"></div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item v-for="(item, index) in navBarFileLevels" :key="index">
                <span :class="{ nav__title: item.current }">{{item.title}}</span>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div>已全部加载，共{{total}}个</div>
        </div>
        <listable
          :key="timer"
          ref="listable"
          :tableData="tableData"
          :tableQuery="tableQuery"
          @ischeckeds="ischeckeds"
          v-show="isTable"
          @close-tip="upboxCancel"
          @get-data="getListData"
          @showupbox="clickUpbox"
          @cancel-create="handleCancelCreate"
          @cd-directory="handleCdDirectory"
          @delete-ids="handleDeleteList"
        ></listable>
        <listfile :datas="tableData" @showupbox="clickUpbox" v-show="!isTable"></listfile>
      </el-main>
    </el-container>
    <div id="upbox" ref="upbox">
      <el-link>
        <el-upload
          class="upload"
          :action="uploadUrl"
          :headers="uploadHeader"
          :data="uploadParams"
          ref="upload"
          :before-upload="beforeUploadSingle"
          :on-progress="uploadProgress"
          :on-success="onsuccess"
          :on-error="onError"
          :show-file-list="false"
        >上传</el-upload>
      </el-link>
      <el-link @click="downloadFile">下载</el-link>
      <el-link @click="handleDeleteCurrent">删除</el-link>
      <el-link @click="rename">重命名</el-link>
      <el-link @click="copyTo">复制到</el-link>
      <el-link @click="moveToNewDirectory">移动到</el-link>
<!--      <el-link @click="editTag">编辑标签</el-link>-->
      <el-link @click="upboxCancel">取消</el-link>
    </div>
    <UploadFile :dialogVisible="isUploadFileVisible"
                @close-modal="handleClose"
                @stop-upload="handleStopUpload"
                @confirm-save="handleSaveFile"
                @current-save="handleCurrentSaveFile"
                @get-tags="handleGetTagIds"
                v-if="isUploadFileVisible" :currentFileName="currentFileName"
                :currentDirectoryUpload="currentDirectoryUpload" :saveFileData="saveFileData"
                :fileInfo="uploadFileInfo" :progress="progress" :uploadState="uploadState"/>
    <moveAndCopyModule :dialogVisible="isMoveAndCopyModuleVisible" :isMoveOrCopy="isMoveOrCopy"
                       :row="tableRowDetail.row" :currentData="currentData" :tableQuery="tableQuery" :moveType="moveType"
                       @close-modal="handleCloseMove" @update-list="getListData" @close-tip="upboxCancel"/>
  </div>
</template>
<script>
// 鼠标右键禁止浏览器默认
import moveAndCopyModule from './datumModule/moveAndCopyModule';
import listable from './listTable';
import listfile from './listFile';
import {
  getDatumListClient,
  createNewFileClient,
  getAllTagsClient,
  labelScreeningClient,
  deleteListClient
} from '@/api/datumInterface';
import UploadFile from './datumModule/uploadFile';
import { getToken } from '@/utils/auth';
import { exportFile } from '@/utils/documentEnum';
// document.oncontextmenu = function(ev) {
//   ev.preventDefault();
// };
export default {
  name: 'complete',
  components: {
    listable,
    listfile,
    UploadFile,
    moveAndCopyModule
  },
  data() {
    return {
      // 列表当前的行数据
      currentData: {},
      // 用来区分是右击移动还是头部移动
      moveType: 'rightMove',
      // 判断是复制还是移动
      isMoveOrCopy: 'move',
      isMoveAndCopyModuleVisible: false,
      // 从子组件获取到的列表数据
      listRows: [],
      ids: [],
      allTags: [
        {
          tagName: '所有',
          id: '-1'
        }
      ],
      tagIds: [],
      saveFileData: '',
      uploadHeader: { Authorization: 'Bearer ' + getToken('token') },
      uploadUrl: 'api/bjfiles/files/upload',
      // 记录上一层级
      previousParentId: [],
      // 当前层级的文件名
      currentFileName: '',
      navBarFileLevels: [{ current: true, title: '所有文件' }],
      isUploadFileVisible: false,
      // 上传状态
      uploadState: -1,
      // 文件信息
      uploadFileInfo: {},
      // 进度
      progress: 0,
      isTable: true,
      tableRowDetail: {},
      // 从当前目录上传文件
      currentDirectoryUpload: '',
      // 查询参数
      tableQuery: {
        projectId: localStorage.getItem('projectId'), // 项目ID，暂时先写死
        parentId: '-1',
        content: ''
      },
      // todo 企业id暂时写死
      uploadParams: {
        companyId: localStorage.getItem('companyId')
      },
      total: null,
      tableData: [],
      ischecked: [],
      mathNum: 0,
      timer: ''
    };
  },
  created() {
    this.getListData();
  },
  mounted() {
    this.getAllTags();
  },
  methods: {
    // 获取列表数据
    getListData() {
      var arr = Object.keys(this.$route.query);
      if (arr.length !== 0) {
        this.tableQuery.parentId = this.$route.query.parentId;
      }
      const data = { ...this.tableQuery };
      if (!data.content) {
        delete data.content;
      }
      getDatumListClient(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    // 右击打开移动文件窗口
    moveToNewDirectory() {
      this.isMoveOrCopy = 'move';
      this.isMoveAndCopyModuleVisible = true;
      this.moveType = 'rightMove';
    },
    // 右击打开复制文件窗口
    copyTo() {
      this.isMoveOrCopy = 'copy';
      this.isMoveAndCopyModuleVisible = true;
      this.moveType = 'rightMove';
    },
    currentMoveTo() {
      this.moveType = 'headMove';
      this.isMoveAndCopyModuleVisible = true;
      this.currentData = this.listRows[0];
    },
    copyCurrent() {
      this.moveType = 'headMove';
      this.isMoveAndCopyModuleVisible = true;
      this.currentData = this.listRows[0];
    },
    // 获得要删除的列表项
    handleDeleteList(val) {
      this.listRows = val;
    },
    // 标签筛选
    handleCommand(command) {
      if (command.item.id === '-1') {
        return this.getListData();
      }
      const data = { tagIds: [command.item.id] };
      labelScreeningClient(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
        }
      });
    },
    // 获取当前项目下所有标签
    getAllTags() {
      const data = { projectId: this.tableQuery.projectId };
      getAllTagsClient(data).then(res => {
        if (res.code === 200) {
          this.allTags = this.allTags.concat(res.data.list);
        } else {
          return this.$message.error(res.message);
        }
      });
    },
    // 获取所绑定的标签
    handleGetTagIds(val) {
      this.tagIds = val;
      this.$message.success('绑定成功');
    },
    rename() {
      this.upboxCancel();
      const row = this.tableRowDetail.row;
      this.$refs.listable.handleChangeFileName(row);
    },
    // 进入下一层级目录
    handleCdDirectory(val) {
      // 首先记录上一层级的parentId
      this.previousParentId.push(this.tableQuery.parentId);
      // 记录当前层级的文件名
      this.currentFileName = val.fileName;
      this.navBarFileLevels[this.navBarFileLevels.length - 1].current = false;
      this.navBarFileLevels.push({
        current: true,
        title: this.currentFileName
      });
      // 记录当前层级
      this.tableQuery.parentId = val.id;
      this.getListData();
    },
    // 返回上一级
    backPreviousLevel() {
      if (this.navBarFileLevels.length >= 2) {
        this.navBarFileLevels.pop();
        this.navBarFileLevels[this.navBarFileLevels.length - 1].current = true;
        this.tableQuery.parentId = this.previousParentId[
          this.previousParentId.length - 1
        ];
        this.previousParentId.pop();
        this.getListData();
      }
    },
    upboxCancel() {
      this.$refs.upbox.style.display = 'none';
    },
    handleCancelCreate() {
      this.tableData.shift();
    },
    // 上传单个文件
    beforeUploadSingle(file) {
      this.uploadFileInfo = file;
      this.isUploadFileVisible = true;
    },
    // 从当前目录上传文件
    beforeUploadCurrentDirectory(file) {
      this.uploadFileInfo = file;
      this.currentDirectoryUpload = 'current';
      this.isUploadFileVisible = true;
    },
    // 上传进度
    uploadProgress(e) {
      this.progress = e.percent;
    },
    // 加行
    handleAdd() {
      const row = { fileName: '' };
      this.tableData.unshift(row);
    },
    //  选中
    ischeckeds(val) {
      this.ischecked = val;
    },
    // 全局删除
    handleDeleteGlobal() {
      this.listRows.forEach((v, i) => {
        this.ids[i] = v.id;
      });
      const data = { ids: this.ids };
      this.httpClientDelete(data);
    },
    // 删除单一项
    handleDeleteCurrent() {
      const data = { ids: [this.tableRowDetail.row.id] };
      this.httpClientDelete(data);
    },
    // 删除接口
    httpClientDelete(data) {
      deleteListClient(data)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.getListData();
          } else {
            return this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.upboxCancel();
        });
    },
    onsuccess(response) {
      this.uploadState = 1;
      if (response.code === 200) {
        this.saveFileData = response.data;
      }
    },
    onError(err) {
      this.uploadState = 0;
      this.$message.error(err.message);
    },
    handleSaveFile() {
      const data = {
        ...this.saveFileData,
        companyId: this.uploadParams.companyId,
        projectId: this.tableQuery.projectId,
        parentId: this.tableRowDetail.row.id,
        fileType: 1,
        tagIds: this.tagIds
      };
      this.createNewFile(data);
    },
    // 从当前目录上传文件
    handleCurrentSaveFile() {
      const data = {
        ...this.saveFileData,
        companyId: this.uploadParams.companyId,
        projectId: this.tableQuery.projectId,
        parentId: this.tableQuery.parentId,
        fileType: 1,
        tagIds: this.tagIds
      };
      this.createNewFile(data);
    },
    // 创建文件请求
    createNewFile(data) {
      createNewFileClient(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getListData();
        } else {
          return this.$message.error(res.message);
        }
      });
    },
    // 下载文件
    downloadFile() {
      const row = this.tableRowDetail.row;
      const fileBaseUrl = 'http://192.168.1.8:18051/bjfiles/filesFilter/';
      const fileUrl = fileBaseUrl + row.fileId;
      exportFile(fileUrl, row.fileName);
      this.upboxCancel();
    },
    copy() {
      const Input = document.createElement('input');
      Input.value = '复制内容';
      document.body.appendChild(Input);
      Input.select(); // 选择对象
      document.execCommand('Copy'); // 执行浏览器复制命令
      Input.className = 'Input';
      Input.style.display = 'none';
      alert('复制成功');
    },
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
    handleClose() {
      this.isUploadFileVisible = false;
    },
    // 停止上传
    handleStopUpload() {
      this.$refs.upload.abort();
    },
    handleCloseMove() {
      this.isMoveAndCopyModuleVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.tag__row__color {
  display: inline-block;
  width: px2rem(21);
  transform: translateX(35px);
  height: px2rem(21);
  border-radius: 50%;
}
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
    .upload {
      width: px2rem(130);
      padding: px2rem(0) px2rem(20);
      display: inline-block;
      .el-button {
        padding: px2rem(10) px2rem(20);
        font-size: px2rem(16);
      }
    }
    .el-button {
      padding: px2rem(10) px2rem(20);
    }
    .el-button::before {
      margin-right: px2rem(8);
    }
    .el-input {
      margin: 0 px2rem(10);
      padding: 0 px2rem(10);
      /deep/ .el-input__inner {
        height: px2rem(38);
        line-height: px2rem(38);
      }
    }
    .right-tag {
      width: px2rem(120);
      height: px2rem(34);
      line-height: px2rem(34);
      .el-button {
        width: px2rem(44);
        padding: px2rem(10) px2rem(15);
      }
    }
  }

  .el-main {
    min-height: calc(100vh - 12rem);
    .header {
      height: px2rem(60);
      line-height: px2rem(60);
      font-size: px2rem(13);
      color: $selfTitle;
      padding: 0 px2rem(20);
      border-bottom: px2rem(1) solid $bors;
      .tags {
        width: px2rem(30);
      }
      .tags:first-child {
        width: px2rem(80);
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
  }
}
</style>
