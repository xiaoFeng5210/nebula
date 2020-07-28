<template>
    <div class="g-box">
      <el-dialog
        :title="title"
        :visible="dialogVisible"
        width="45%"
        :show-close="false"
      >
        <div class="upload">
          <el-row>
            <el-col :span="10">
              <div class="upload__title">文件名</div>
            </el-col>
            <el-col :span="6">
              <div class="upload__title">进度</div>
            </el-col>
            <el-col :span="4">
              <div class="upload__title" v-if="currentFileName">所在文件夹</div>
            </el-col>
            <el-col :span="4">
              <div class="upload__title">状态</div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px;">
            <el-col :span="10">
              <div class="file__name">{{fileInfo.name}}</div>
            </el-col>
            <el-col :span="6">
              <div class="file__progress">
                <span>{{progress}}%</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="paper__file">
                {{ currentFileName }}
              </div>
            </el-col>
            <el-col :span="4">
              <div class="file__state" style="color: green;" v-if="uploadState === 1">上传成功</div>
              <div class="file__state" style="color: red;" v-if="uploadState === 0">上传失败</div>
              <div class="file__state" v-if="uploadState === -1">上传中...</div>
            </el-col>
          </el-row>
        </div>
        <div class="operate">
          <el-link type="primary">关联构件</el-link>
          <el-link type="primary" style="margin-left: 30px;" @click="openTagWindow">添加标签</el-link>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">保存</el-button>
      </span>
      </el-dialog>
      <FileTags :dialogVisible="isFileTagsVisible" v-if="isFileTagsVisible"
                v-bind="$attrs" v-on="$listeners"
                @close-tag="handleClose"/>
    </div>
</template>

<script>
import FileTags from './fileTags';
export default {
  name: 'uploadFile',
  components: {
    FileTags
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    fileInfo: {
      type: File
    },
    progress: {
      type: Number,
      default: 0
    },
    // 上传状态
    uploadState: {
      type: Number
    },
    // 当前目录名
    currentFileName: {
      type: String,
      default: '文件名'
    },
    // 判断从当前目录上传文件
    currentDirectoryUpload: {
      type: String
    }
  },
  data() {
    return {
      isFileTagsVisible: false
    };
  },
  mounted() {
    console.log(this.fileInfo);
  },
  computed: {
    title() {
      return this.currentFileName;
    }
  },
  methods: {
    openTagWindow() {
      this.isFileTagsVisible = true;
    },
    handleConfirm() {
      if (this.currentDirectoryUpload === 'current') { this.$emit('current-save'); }
      this.$emit('confirm-save');
      this.$emit('close-modal');
    },
    handleCancel() {
      // 取消上传
      this.$emit('stop-upload');
      this.$emit('close-modal');
    },
    handleClose() {
      this.isFileTagsVisible = false;
    }
  }
};
</script>

<style scoped lang="scss">
.operate {
  margin-top: px2rem(30);
  margin-left: 15%;
}
.upload {
  .upload__title {
    text-align: center;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:bold;
  }
  .file__name, .file__progress, .paper__file, .file__state {
    text-align: center;
  }
}
</style>
