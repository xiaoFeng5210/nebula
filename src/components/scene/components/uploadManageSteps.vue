<template>
    <div class="g-box">
      <el-steps :space="200" :active="0" finish-status="success">
        <el-step title="上传模型"></el-step>
        <el-step title="关联目录节点"></el-step>
        <el-step title="提交转换"></el-step>
        <el-step title="提交转换"></el-step>
      </el-steps>
    </div>
</template>

<script>
export default {
  name: 'uploadManageSteps'
};
</script>

<style scoped lang="scss">
.g-box {
  width: 99%;
  height: px2rem(105);
  margin-left: px2rem(10);
  background:$bgColor;
  box-shadow:$shadow;
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
    top: px2rem(23)
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
</style>
