<template>
  <div ref="tables" class="listTable">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      height="656"
      @selection-change="onTableSelect"
      @row-contextmenu="rowHandleclick"
      @header-contextmenu="headerHandleclick"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column
        prop="fileName"
        label="文件名"
        sortable
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
<!--          文件图片-->
          <div class="file__image"><img :src="scope.row.fileSuffix
          ? fileTypeEnum[scope.row.fileSuffix] : fileTypeEnum.file" alt=""></div>
<!--          新建文件夹-->
          <div class="file__input" v-if="!scope.row.fileName">
            <el-input size="mini" placeholder="请输入内容" style="width: 300px;" v-model="fileName"></el-input>
            <i
              class="el-icon-check"
              style="font-size: 18px; margin-right: 6px; cursor: pointer"
              @click="handleCreateFile"
            ></i>
            <i
              class="el-icon-close"
              style="font-size: 18px; cursor: pointer"
              @click="cancelCreateFile"
            ></i>
          </div>
          <!--          修改名字-->
          <div class="file__input" v-if="renameIndex === scope.row.id">
            <el-input size="mini" placeholder="请输入内容" style="width: 300px;" v-model="newName"></el-input>
            <i
              class="el-icon-check"
              style="font-size: 18px; margin-right: 6px; cursor: pointer"
              @click="handleRename(scope.row)"
            ></i>
            <i class="el-icon-close" style="font-size: 18px; cursor: pointer" @click="cancelRename"></i>
          </div>
          <!--          渲染文件名称-->
          <div
            v-if="scope.row.fileName && renameIndex !== scope.row.id"
            style="display: inline-block"
          >
            <el-tooltip class="item" effect="dark" :content="scope.row.fileName" placement="top">
              <span style="cursor: pointer;" @click="handleCdDirectory(scope.row)">{{scope.row.fileName}}</span>
            </el-tooltip>
            <!--            标签 -->
            <div class="file__tags" v-if="scope.row.fileType && !tagShow">
              <div class="tag" v-for="(tag, index) in scope.row.tags" :key="index">
                <div class="tag__color" :style="{ background: tag.tagColor }"></div>
                <div class="tag__text">{{tag.tagName}}</div>
              </div>
              <div class="edit__tag">
                <el-link type="primary" @click="editTag(scope.row)">编辑标签</el-link>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签" v-if="tagShow">
        <template slot-scope="scope">
          <div class="file__tags d-flex">
            <div class="tag" v-for="(tag, index) in scope.row.tags" :key="index">
              <div class="tag__color" :style="{ background: tag.tagColor }"></div>
              <div class="tag__text">{{tag.tagName}}</div>
            </div>
            <div v-if="scope.row.fileType !== 0" @click="editTag(scope.row)" class="editTag">
              <el-tooltip class="item" effect="dark" content="编辑标签" placement="top">
                <img src="../../assets/icon/plus.png" alt />
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="department" label="创建人/上传人" width="300"></el-table-column>
      <el-table-column prop="fileSize" label="大小" sortable width="200"></el-table-column>
      <el-table-column prop="updateTime" label="修改日期" sortable width="260"></el-table-column>
      <el-table-column label="关联" width="100">
        <template slot-scope="scope">
          <i class="el-icon-link icon__style" style="font-size: 22px;"
             v-if="scope.row.fileType" @click="relevancyFrameMember(scope.row.id)"></i>
        </template>
      </el-table-column>
      <el-table-column label="下载" width="100">
        <template slot-scope="scope">
          <i class="el-icon-download icon__style" v-if="scope.row.fileType"
             style="font-size: 22px;"
             @click="downloadFile(scope.row)">
          </i>
        </template>
      </el-table-column>
      <el-table-column label="收藏" width="100">
        <template slot-scope="scope">
          <i
            class="icon__style el-icon-star-off"
            v-if="scope.row.isFavorite === 0"
            style="font-size: 22px;"
            @click="handleCollect(scope.row)"
          ></i>
          <i
            class="icon__style el-icon-star-on"
            v-if="scope.row.isFavorite === 1"
            style="font-size: 22px;"
            @click="handleCancelCollect(scope.row)"
          ></i>
        </template>
      </el-table-column>
    </el-table>
    <FileTags :dialogVisible="isFileTagsVisible" v-if="isFileTagsVisible"
              :tags="tags" :fileInfo="fileInfo" :isEditState="isEditState" v-on="$listeners"
              @change-state="handleChangeState"
              @close-tag="handleClose"/>
    <RelevancyModule :dialogVisible="isRelevancyModuleVisible" :fileMajorKeyId="fileMajorKeyId"
                     :isCreateState="isCreateState"
                     v-if="isRelevancyModuleVisible" @close-modal="handleCloseRelevancy"/>
    <IframeView :dialogVisible="isIframeView" v-if="isIframeView" :fileIframeData="fileIframeData"
                @close-modal="handleCloseIframe"/>
  </div>
</template>
<script>
import { documentEnum, exportFile } from '@/utils/documentEnum';
import {
  createNewFileClient,
  collectFile,
  renameFileClient
} from '@/api/datumInterface';
import FileTags from './datumModule/fileTags';
import RelevancyModule from './datumModule/relevancyModule';
import IframeView from './datumModule/iframeView';
export default {
  name: 'listTable',
  components: {
    FileTags,
    RelevancyModule,
    IframeView
  },
  props: {
    datas: Array,
    tableQuery: Object,
    tableData: Array
  },
  data() {
    return {
      fileIframeData: null,
      isIframeView: false,
      fileMajorKeyId: null,
      isRelevancyModuleVisible: false,
      tagShow: false,
      // 判断关联是创建文件时还是在列表中关联的
      isCreateState: false,
      isEditState: false,
      fileInfo: {},
      tags: [],
      isFileTagsVisible: false,
      logoInitStatus: -1,
      isCollect: -1,
      renameIndex: '',
      fileName: '',
      // 新名字
      newName: '',
      // 文件图片样式
      fileTypeEnum: documentEnum,
      isCheck: [],
      rechristenList: []
    };
  },
  mounted() {
    this.$refs.tables.oncontextmenu = function() {
      return false;
    };
    this.$nextTick(() => {
      if (this.$route.path === '/collect') {
        this.tagShow = true;
      } else {
        this.tagShow = false;
      }
    });
  },
  methods: {
    // 下载文件
    downloadFile(row) {
      const fileBaseUrl = 'http://192.168.1.8:18051/bjfiles/filesFilter/';
      const fileUrl = fileBaseUrl + row.fileId;
      exportFile(fileUrl, row.fileName);
    },
    // 关联构件
    relevancyFrameMember(id) {
      this.isRelevancyModuleVisible = true;
      this.fileMajorKeyId = id;
      this.isCreateState = false;
    },
    editTag(row) {
      this.isEditState = true;
      this.tags = row.tags;
      this.fileInfo = row;
      this.isFileTagsVisible = true;
    },
    handleChangeState() {
      this.isEditState = false;
    },
    // hover事件出现编辑标签
    // editTextVisible() {
    //   this.isEditTextVisible = true;
    // },
    // editTextClearAway() {
    //   this.isEditTextVisible = false;
    // },
    // 收藏
    handleCollect(row) {
      this.httpClientCollect(row);
    },
    // 取消收藏
    handleCancelCollect(row) {
      this.$confirm('此操作将取消收藏该文件/文件夹, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.httpClientCollect(row);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
    },
    // 公用收藏接口
    httpClientCollect(row) {
      const data = { fileId: row.id };
      collectFile(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.$emit('get-data');
        } else {
          return this.$message.error(res.message);
        }
      });
    },
    // 修改名称
    handleChangeFileName(row) {
      // 先展示出来
      this.renameIndex = row.id;
    },
    // 修改名字
    handleRename(row) {
      if (row.fileSuffix) {
        this.newName = this.newName + '.' + row.fileSuffix;
      }
      const data = {
        fileName: this.newName,
        id: row.id
      };
      renameFileClient(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.renameIndex = '-1';
          this.$emit('get-data');
        } else {
          return this.$message.error(res.message);
        }
      });
    },
    cancelRename() {
      this.renameIndex = '-1';
      this.$emit('close-tip');
    },
    handleCdDirectory(row) {
      if (!row.fileType) {
        this.$emit('cd-directory', row);
      } else {
        // todo 查看文件
        this.fileIframeData = row;
        this.isIframeView = true;
      }
    },
    handleCreateFile() {
      const data = {
        // todo 以后需要重新拿企业id
        companyId: localStorage.getItem('companyId'),
        projectId: this.tableQuery.projectId,
        parentId: this.tableQuery.parentId,
        fileType: 0,
        fileName: this.fileName
      };
      createNewFileClient(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.$emit('get-data');
        }
      });
    },
    // 取消新建文件
    cancelCreateFile() {
      this.$emit('cancel-create');
    },
    rowHandleclick(row, column, event) {
      const data = {
        row: row,
        ev: event
      };
      this.$emit('showupbox', data);
    },
    // 头部被点击
    headerHandleclick() {
      this.$emit('showupbox');
    },
    onTableSelect(rows) {
      this.$emit('delete-ids', rows);
    },
    handleSelectionChange() {},
    handleClose() {
      this.isFileTagsVisible = false;
    },
    handleCloseRelevancy() {
      this.isRelevancyModuleVisible = false;
    },
    handleCloseIframe() {
      this.isIframeView = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.file__tags {
  display: flex;
  .tag {
    margin-right: px2rem(7);
    display: flex;
    padding-left: px2rem(6);
    padding-right: px2rem(6);
    background-color: $borderBg;
    border-radius: px2rem(12);
    .tag__color {
      transform: translateY(66%);
      width: px2rem(11);
      height: px2rem(11);
      /*background:rgba(0,152,255,1);*/
      border-radius: 50%;
    }
    .tag__text {
      font-size: px2rem(12);
      font-weight: normal;
    }
  }
  .editTag {
    cursor: pointer;
  }
}
.listTable {
  .file__image {
    transform: translate(-2px, 5px);
    display: inline-block;
  }
  .file__input {
    display: inline-block;
    .icon__confirm .icon__cancel {
    }
    .icon__confirm {
    }
  }
  .el-input {
    border: none;
    outline: none;
  }
  /deep/.el-input.is-disabled .el-input__inner {
    background-color: $bgColor;
    border-color: $bgColor;
    color: $inputplace;
  }
  /deep/.el-input.is-disabled .el-input__inner:hover {
    background-color: #f5f7fa;
    border-color: #f5f7fa;
  }
}
.icon__style {
  cursor: pointer;
}
</style>
