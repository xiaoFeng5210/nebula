<template>
  <div class="g-box">
    <div class="steps__container">
      <div class="step-box">
        <el-steps :space="200" :active="0" finish-status="success">
          <el-step title="上传模型"></el-step>
          <el-step title="关联目录节点"></el-step>
          <el-step title="提交转换"></el-step>
          <el-step title="提交转换"></el-step>
        </el-steps>
      </div>
    </div>

    <div class="m__container">
      <!-- 左侧树模块 -->
      <div class="tree__container">
        <div class="asideTree bg-white">
          <div class="tops">
            <div class="title">目录树</div>
            <div class="tree__line"></div>
          </div>
          <el-tree
            class="filter-tree"
            :data="treeList"
            ref="tree"
            node-key="id"
            draggable
            default-expand-all
            :highlight-current="true"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            @node-click="nodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <el-checkbox v-if="data.oldFileName" v-model="data['ischeck']">
                <el-input v-model="data.oldFileName" :readonly="true"></el-input>
              </el-checkbox>
              <el-input
                v-if="data.treeName"
                v-model="data.treeName"
                :readonly="data.isreadonly"
                @blur="onBlur(data)"
              ></el-input>
              <span>
                <el-button
                  type="text"
                  @click.stop="handleEditorNode(data,node)"
                  class="el-icon-edit"
                  v-if="!data.file && !data.oldFileName"
                ></el-button>

                <el-button
                  type="text"
                  @click.stop="() => remove(node, data)"
                  class="el-icon-delete"
                  v-if="!data.file && !data.oldFileName"
                ></el-button>
                <el-button
                  v-if="!data.oldFileName"
                  type="text"
                  @click.stop="() => append(data, node)"
                  class="el-icon-circle-plus-outline"
                ></el-button>
                <el-button
                  v-if="data.oldFileName"
                  type="text"
                  @click.stop="() => reunbindNode(data, node)"
                  class="el-icon-close"
                ></el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="relevancy__container">
        <div class="button__group">
          <div>
            <el-button
              type="primary"
              plain
              class="second__bottom second__button"
              icon="el-icon-arrow-right"
              @click="unbindNode"
            >解除关联</el-button>
          </div>
          <div>
            <el-button
              type="primary"
              plain
              icon="el-icon-arrow-left"
              class="third__button"
              :disabled="tableCheckedLen<1"
              @click="connectNode"
            >关联节点</el-button>
          </div>
          <div>
            <el-button type="primary" class="last__button" @click="submitTrans">提交转换</el-button>
          </div>
        </div>
      </div>
      <!-- 右侧上传模块 -->
      <div class="list__container">
        <div class="tops">
          <div class="title">上传列表</div>
          <div class="title__button">
            <el-button
              class="dangers"
              type="primary"
              plain
              size="small"
              @click="dialogTableVisible = true"
            >上传进度</el-button>
            <el-button type="primary" size="small" @click="uploadModule">批量上传</el-button>
            <el-button class="dangers" type="danger" plain size="small">删除</el-button>
            <!-- <el-button type="primary" size="small">自动关联</el-button> -->
          </div>
        </div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="oldFileName" label="文件名称"></el-table-column>
          <el-table-column label="上传状态">
            <template slot-scope="scope">{{ scope.row.fileStatus|filterStatus }}</template>
          </el-table-column>
          <el-table-column prop="updateTime" label="上传时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                class="dangers"
                type="danger"
                plain
                size="small"
                @click="deleteFile(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="上传文件进度" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
      <div class="page">
        <div class="d-flex jc-start ai-center">
          <div id="filePicker" style="margin-right:20px;">选择文件</div>
          <el-button type="primary" size="mini" plain @click="uplods">开始上传</el-button>
        </div>
        <div class="file-panel">
          <h2>文件列表</h2>
          <div class="file-list">
            <ul
              class="file-item"
              :class="`file-${file.id}`"
              v-for="file in fileList"
              :key="file.id"
            >
              <li class="file-type" :icon="fileCategory(file.ext)"></li>
              <li class="file-name">{{file.name}}</li>
              <li class="file-size">{{fileSize(file.size)}}</li>
              <li class="file-status">上传中...</li>
              <li class="file-operate">
                <a title="开始" @click="resume(file)">
                  <i class="iconfont icon-control-play"></i>
                </a>
                <a title="暂停" @click="stop(file)">
                  <i class="iconfont icon-video-pause"></i>
                </a>
                <a title="移除" @click="removes(file)">
                  <i class="iconfont icon-close-big"></i>
                </a>
              </li>
              <li class="progress"></li>
            </ul>
            <div class="no-file" v-if="!fileList.length">
              <i class="iconfont icon-empty-file"></i> 暂无待上传文件
            </div>
          </div>
        </div>

        <vue-upload
          ref="uploader"
          uploadButton="#filePicker"
          multiple
          @fileChange="fileChange"
          @progress="onProgress"
          @success="onSuccess"
        ></vue-upload>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  modelFilelist,
  getAllTree,
  delByIdInfo,
  savetreeItem,
  updatetreeItem,
  createContact,
  delContact,
  convertProject,
  delByIdFile
} from '../../api/proApi/aboutengin';
import $ from 'jquery';
import WebUploader from 'webuploader';
import vueUpload from './upload';
export default {
  name: 'uploadManage',
  components: {
    WebUploader,
    vueUpload
  },
  filters: {
    filterStatus(val) {
      switch (val) {
      case 0:
        return '上传中';
        break;
      case 1:
        return '已上传';
        break;
      case 2:
        return '未转换';
        break;
      case 3:
        return '转换中';
        break;
      case 4:
        return '已完成';
        break;
      case 5:
        return '转换失败';
        break;
        return '暂无';
        break;
      default:
        break;
      }
    }
  },
  data() {
    return {
      id: 1,
      tableData: [
        {
          fileName: '秉匠科技',
          date: '2020-05-10'
        }
      ],
      tableCheckedLen: 0,
      tableCheckedArr: [],
      fileParams: {
        projectId: localStorage.getItem('projectId'),
        page: 1,
        size: 10
        // fileStatus: 1
      },
      total: 0,
      treeList: [],
      defaultProps: {
        children: 'nodes',
        label: 'label'
      },
      addParams: {
        treeName: '新增目录',
        projectId: localStorage.getItem('projectId'),
        parentId: '',
        treeType: 0 // 0目录，1文件
      },
      updateParams: {
        treeName: '',
        id: 0
      },
      checkList: [],
      nodeTreeId: null,
      dialogTableVisible: false,
      fileList: [],
      onlyGuid: '',
      uploadformData: {}
    };
  },
  mounted() {
    this.getFilelist();
    this.getAllTreeList();
  },
  computed: {
    uploader() {
      return this.$refs.uploader;
    }
  },
  methods: {
    uplods() {
      this.$refs.uploader.uploads();
    },
    getAllTreeList() {
      getAllTree('2e5ed14a756c30c6dd702cdae05a6879').then(res => {
        if (res && res.code === 200) {
          this.treeList = res.data;
        }
      });
    },
    // el-tree
    handleEditorNode(data) {
      data.isreadonly = true;
    },
    onBlur(data) {
      var rename = '';
      var reid = 0;
      if (data.treeName) {
        rename = data.treeName;
        reid = data.treeId;
      } else if (data.oldFileName) {
        rename = data.oldFileName;
        reid = data.fileId;
      }
      data.isreadonly = false;
      this.updateParams.id = reid;
      this.updateParams.treeName = rename;
      if (rename !== data.treeNameTwo) {
        updatetreeItem(this.updateParams).then(res => {
          if (res && res.code === 200) {
            this.$message.success('修改成功');
          } else {
            this.$message.success('修改失败');
          }
          this.getAllTreeList();
        });
      }
    },
    remove(node, data) {
      // console.log(data, node)
      delByIdInfo(data.treeId).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功');
          this.getAllTreeList();
        }
      });
    },
    append(data) {
      this.addParams.parentId = data.treeId;
      this.addParams.projectId = localStorage.getItem('projectId');
      this.addParams.treeType = 0;
      savetreeItem(this.addParams).then(res => {
        if (res.code === 200) {
          this.$message.success('新增成功');
          this.getAllTreeList();
        }
      });
    },
    // table
    handleSelectionChange(val) {
      if (val) {
        console.log(val, '选中打印');
        this.tableCheckedLen = val.length;
        this.tableCheckedArr = val;
      }
    },
    getFilelist() {
      modelFilelist(this.fileParams).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    nodeClick(data) {
      if (data.treeId) {
        this.nodeTreeId = data.treeId;
      } else {
        this.nodeTreeId = 0;
        return false;
      }
    },
    reunbindNode(data, node) {
      this.checkList = [];
      if (data) {
        this.checkList.push({
          fileId: node.data.fileId,
          treeId: node.parent.data.treeId
        });
        if (this.checkList && this.checkList.length > 0) {
          delContact(this.checkList).then(res => {
            if (res.code === 200) {
              this.getFilelist();
              this.getAllTreeList();
              this.$message.success('解除关联成功');
            } else {
              this.$message.error('解除关联失败,请重新关联');
              return false;
            }
          });
        } else {
          this.$message.error('请选择解除关联的文件节点');
          return false;
        }
      }
    },
    unbindNode() {
      // 解绑节点
      this.checkList = [];
      this.treeList.map(x => {
        if (x.ischeck) {
          this.checkList.push({
            fileId: x.fileId,
            treeId: x.treeId
          });
        } else if (x.nodes) {
          x.nodes.map(y => {
            if (y.ischeck) {
              this.checkList.push({
                fileId: y.fileId,
                treeId: x.treeId
              });
            } else if (y.nodes) {
              y.nodes.map(z => {
                if (z.ischeck) {
                  this.checkList.push({
                    fileId: z.fileId,
                    treeId: y.treeId
                  });
                } else if (z.nodes) {
                  z.nodes.map(j => {
                    if (j.ischeck) {
                      this.checkList.push({
                        fileId: j.fileId,
                        treeId: z.treeId
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
      if (this.checkList && this.checkList.length > 0) {
        delContact(this.checkList).then(res => {
          if (res.code === 200) {
            this.getFilelist();
            this.getAllTreeList();
            this.$message.success('解除关联成功');
          } else {
            this.$message.error('解除关联失败,请重新关联');
            return false;
          }
        });
      } else {
        this.$message.error('请选择解除关联的文件节点');
        return false;
      }
    },
    connectNode() {
      // 关联节点
      if (!this.nodeTreeId) {
        this.$message.error('请选择关联的树目录节点');
        return false;
      }
      var fileId = [];
      this.tableCheckedArr.map(res => {
        if (res.id) {
          fileId.push(res.id);
        }
      });
      var fileStr = fileId.toString();
      var form = new FormData();
      form.append('fileId', fileStr);
      form.append('treeId', this.nodeTreeId);
      createContact(form).then(res => {
        if (res.code === 200) {
          this.$message.success('关联成功');
          this.getAllTreeList();
          this.getFilelist();
        } else {
          this.$message.error('请重新关联');
        }
      });
    },
    submitTrans() {
      // 提交转换
      convertProject('2e5ed14a756c30c6dd702cdae05a6879').then(res => {
        if (res.code === 200) {
          this.$message.success('转换成功');
          this.getAllTreeList();
          this.getFilelist();
        } else {
          this.$message.error('转换失败');
        }
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 批量上传
    uploadModule() {
      this.dialogTableVisible = true;
    },
    deleteFile(row) {
      delByIdFile(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success('删除文件成功');
          this.getFilelist();
        }
      });
    },
    fileChange(file) {
      if (!file.size) return;
      this.fileList.push(file);
      // console.log(file);
    },
    onProgress(file, percent) {
      $(`.file-${file.id} .progress`).css('width', percent * 100 + '%');
      $(`.file-${file.id} .file-status`).html((percent * 100).toFixed(2) + '%');
    },
    onSuccess() {
      this.$message.success('上传成功');
    },
    resume(file) {
      this.uploader.upload(file);
    },
    stop(file) {
      this.uploader.stop(file);
    },
    removes(file) {
      // 取消并中断文件上传
      this.uploader.cancelFile(file);
      // 在队列中移除文件
      this.uploader.removeFile(file, true);
      // 在ui上移除
      const index = this.fileList.findIndex(ele => ele.id === file.id);
      this.fileList.splice(index, 1);
    },
    fileSize(size) {
      return WebUploader.Base.formatSize(size);
    },
    fileCategory(ext) {
      let type = '';
      const typeMap = {
        image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'],
        video: ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'],
        text: [
          'doc',
          'txt',
          'docx',
          'pages',
          'epub',
          'pdf',
          'numbers',
          'csv',
          'xls',
          'xlsx',
          'keynote',
          'ppt',
          'pptx'
        ]
      };
      Object.keys(typeMap).forEach(_type => {
        const extensions = typeMap[_type];
        if (extensions.indexOf(ext) > -1) {
          type = _type;
        }
      });
      return type;
    }
  }
};
</script>
<style lang="scss" scoped>
.g-box {
  .step-box {
    width: 99%;
    height: px2rem(105);
    margin-left: px2rem(10);
    background: $bgColor;
    box-shadow: $shadow;
    /deep/ .el-steps {
      margin-left: 50%;
      transform: translate(-50%, 16%);
    }
    /deep/ .el-step__icon-inner {
      font-size: px2rem(27);
    }
    /deep/ .el-step__icon {
      width: px2rem(48);
      height: px2rem(48);
    }
    /deep/ .el-step__line {
      top: px2rem(23);
    }
    /deep/ .el-step__icon {
      color: $stepColor;
      border-color: $stepColor;
    }
    /deep/ .el-step__main .is-process {
      color: $stepColor;
      border-color: $stepColor;
    }
  }
  .asideTree {
    .title {
      margin-top: px2rem(24);
      font-size: px2rem(20);
      color: $treeColor;
    }
    .tops {
      border-bottom: 1px solid $bors;
      margin-left: px2rem(10);
      /*margin-top: px2rem(24);*/
      padding: px2rem(10);
      color: $selfTitle;
      font-size: px2rem(16);
      i {
        width: px2rem(3);
        height: px2rem(16);
        margin: 0 px2rem(5);
        display: inline-block;
      }
      /deep/ .el-input__inner {
        height: px2rem(35);
        border-radius: px2rem(20);
        background: $elInput;
        font-size: px2rem(12);
        margin-top: px2rem(14);
        padding: px2rem(4) px2rem(20);
      }
      .tree__line {
        width: px2rem(704);
        height: px2rem(0);
        border: $treeLine;
        opacity: 1;
      }
    }
    .el-tree {
      margin-top: px2rem(30);
      /deep/.el-tree-node__content:hover {
        color: $bluebor;
        border: 0 !important;
        /deep/ .el-input__inner {
          padding: px2rem(5);
          font-size: px2rem(14);
          height: px2rem(20);
          line-height: px2rem(20);
          border: none;
          outline: none;
          background: none;
        }
      }
      /deep/.el-tree-node:focus > .el-tree-node__content {
        color: $bluebor;
        background: $borderBg;
        border: 0 !important;
        /deep/ .el-input__inner {
          padding: px2rem(5);
          font-size: px2rem(14);
          height: px2rem(20);
          line-height: px2rem(20);
          border: none;
          outline: none;
          background: none;
        }
      }
      .custom-tree-node {
        width: 80%;
        display: inline-flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        /deep/ .el-input__inner {
          padding: px2rem(5);
          font-size: px2rem(14);
          height: px2rem(20);
          line-height: px2rem(20);
          border: none;
          outline: none;
        }
        /deep/ .el-button {
          margin-right: 5px;
        }
      }
    }
  }
  .m__container {
    display: flex;
    justify-content: space-between;
    height: px2rem(919);
    margin-top: px2rem(10);
    width: 99%;
    margin-left: px2rem(10);
    background: $bgColor;
    box-shadow: $shadow;
    .tree__container {
      width: 41%;
      height: 100%;
      border-right: 1px solid $bors;
    }
    .relevancy__container {
      .button__group {
        margin-top: px2rem(246);
        margin-left: 50%;
        transform: translateX(-88%);
        .second__bottom {
          margin-top: px2rem(67);
          margin-bottom: px2rem(22);
        }
        .last__button {
          margin-top: px2rem(53);
        }
        .first__button,
        .second__button,
        .third__button {
          transform: translateX(-8%);
        }
      }
    }
    .list__container {
      width: 49%;
      height: 100%;
      border-left: 1px solid $bors;
      .tops {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid $bors;
        margin-left: px2rem(10);
        padding: px2rem(10);
        color: $selfTitle;
        font-size: px2rem(16);
        .title {
          margin-top: px2rem(24);
          font-size: px2rem(20);
          color: $treeColor;
        }
      }
      /deep/.el-table td {
        text-align: left;
        .dangers {
          border-color: $btnbor;
          color: $btnhover;
          background: $btnbor;
        }
        .dangers:hover {
          color: $bgColor;
          border-color: $btnhover;
          background: $btnhover;
        }
      }
    }
  }
  $h-row: 50px;
  .file-panel {
    width: 840px;
    margin-top: 10px;
    box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.1);
    > h2 {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      border-radius: 4px 4px 0 0;
      border-bottom: 1px solid #ccc;
      background-color: #fff;
    }
    .file-list {
      position: relative;
      height: 360px;
      overflow-y: auto;
      background-color: rgb(250, 250, 250);
    }
    .file-item {
      position: relative;
      height: $h-row;
      line-height: $h-row;
      padding: 0 10px;
      border-bottom: 1px solid #ccc;
      background-color: #fff;
      z-index: 1;
      > li {
        display: inline-block;
      }
    }
    .file-type {
      width: 24px;
      height: 24px;
      vertical-align: -5px;
    }
    .file-name {
      width: 40%;
      margin-left: 10px;
    }
    .file-size {
      width: 20%;
    }
    .file-status {
      width: 20%;
    }
    .file-operate {
      width: 10%;
      > a {
        padding: 10px 5px;
        cursor: pointer;
        color: #666;
        &:hover {
          color: #ff4081;
        }
      }
    }
    // .file-type[icon=text] {
    //     background: url(../../assets/images/icon/text-icon.png);
    // }
    // .file-type[icon=video] {
    //     background: url(../../assets/images/icon/video-icon.png);
    // }
    // .file-type[icon=image] {
    //     background: url(../../assets/images/icon/image-icon.png);
    // }
    .progress {
      position: absolute;
      top: 0;
      left: 0;
      height: $h-row - 1;
      width: 0;
      background-color: #e2edfe;
      z-index: -1;
    }
    .no-file {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
    }
  }
}
</style>
