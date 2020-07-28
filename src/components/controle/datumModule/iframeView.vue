<template>
    <div class="g__box">
      <el-dialog
        title="查看文件"
        :visible="dialogVisible"
        width="45%"
        :show-close="false"
      >
        <div class="file__preview" v-if="fileIframeData.fileSuffix === 'txt'">
          {{filePreview}}
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
import { downloadAndOnlineClient } from '@/api/datumInterface';
export default {
  name: 'iframeView',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    fileIframeData: {
      type: Object
    }
  },
  data() {
    return {
      fileBaseUrl: 'http://192.168.1.8:18051/bjfiles/filesFilter/',
      filePreview: null
    };
  },
  mounted() {
    this.downloadAndOnline();
  },
  computed: {
    previewUrl() {
      return this.fileBaseUrl + this.fileIframeData.fileId;
    }
  },
  methods: {
    // 请求接口获得要预览的信息
    downloadAndOnline() {
      const data = {
        fileId: this.fileIframeData.fileId,
        isOnline: true,
        fileName: this.fileIframeData.fileName
      };
      downloadAndOnlineClient(data).then(res => {
        this.filePreview = res;
      });
    },
    handleConfirm() {
      this.$emit('close-modal');
    },
    handleCancel() {
      this.$emit('close-modal');
    }
  }
};
</script>

<style scoped lang="scss">
.file__preview {
}
</style>
