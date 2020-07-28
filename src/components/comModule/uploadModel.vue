<template>
  <div class="uploadModel">
    <el-dialog title="上传模型" :visible.sync="modelDialog" :modal="false" width="30%">
      <div>
        <el-button id="chooseFile" type="primary" size="mini" plain>选择文件</el-button>
      </div>
      <el-table :data="fileList" height="330" style="width: 100%">
        <el-table-column type="index" label="序号" width="300"></el-table-column>
        <el-table-column prop="name" label="模型名称"></el-table-column>
<!--        <el-table-column label="进度">-->
<!--          <template slot-scope="scope">-->
<!--            <el-progress :percentage="scope.row.progress"></el-progress>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
      <div class="d-flex">
        <div>上传位置：</div>
        <div>
          <el-button type="text">目录树节点</el-button>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="transformBtn">提交转换</el-button>
      </div>
    </el-dialog>
    <!-- 上传列表弹窗 -->
    <el-dialog
      title="上传列表"
      :visible.sync="listDialog"
      :modal="false"
      width="30%"
    >
      <el-table :data="listData" height="330">
        <el-table-column prop="name"></el-table-column>
        <el-table-column prop="status"></el-table-column>
        <el-table-column prop="progress"></el-table-column>
      </el-table>
    </el-dialog>
    <uploadList ref="uploadList" />
    <vue-upload
      ref="uploader"
      uploadButton="#chooseFile"
      multiple
      @fileChange="fileChange"
      @success="onSuccess"
    ></vue-upload>
  </div>
</template>

<script>
import vueUpload from '@/components/scene/upload';
import uploadList from './uploadList';
export default {
  name: 'uploadModel',
  components: { vueUpload, uploadList },
  data() {
    return {
      // 模型数据
      fileList: [],
      modelDialog: false,
      listDialog: false, // 上传列表弹窗
      listData: [
        {
          name: '资源1.pak',
          status: '转换中',
          progress: '70%'
        }
      ]
    };
  },
  mounted() {},
  methods: {
    onSuccess() {
      this.$message.success('上传成功');
    },
    fileChange(file) {
      if (!file.size) return;
      this.fileList.push(file);
    },
    openModelVisible() {
      this.modelDialog = true;
    },
    transformBtn() {
      this.modelDialog = false;
      // this.listDialog = true;
      this.$refs.uploadList.openModelVisible();
    }
  }
};
</script>

<style lang="scss" scoped></style>
