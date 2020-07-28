<template>
  <div class="uploadList g__box">
    <el-dialog title="上传列表" :visible.sync="modelDialog" :modal="false" width="25%">
      <div class="upload__list">
        <el-row>
          <el-col :span="8">资源.pak</el-col>
          <el-col :span="8">转换中</el-col>
          <el-col :span="8">75%</el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'uploadList',
  data() {
    return {
      modelDialog: false
    };
  },
  methods: {
    openModelVisible() {
      this.modelDialog = true;
    }
  }
};
</script>

<style scoped lang="scss">
.upload__list {
  overflow: auto;
  margin: 0 auto;
  width: px2rem(458);
  height: px2rem(255);
}
</style>
