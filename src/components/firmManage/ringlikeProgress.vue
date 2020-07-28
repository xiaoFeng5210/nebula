<template>
    <div class="g-box">
      <el-progress type="dashboard" :percentage="100" color="#0098FF"></el-progress>
      <div class="progress__inner">
        <div class="progress__first">{{firstLine}}</div>
        <div class="progress__number"><span class="progress__inner__span">{{secondLine}}</span>
          <span class="progress__inner__span">个</span></div>
      </div>
      <div class="progress__bottom">
        {{bottomData}}
      </div>
    </div>
</template>

<script>
export default {
  name: 'ringlikeProgress',
  props: {
    firstLine: {
      type: String
    },
    secondLine: {
      type: String
    },
    bottomData: {
      type: String
    }
  }
};
</script>

<style scoped lang="scss">
.g-box {
  position: relative;
  .progress__inner {
    position: absolute;
    left: 50%;
    top: 30px;
    transform: translateX(-41%);
    .progress__number {
      margin-left: -5px;
    }
    .progress__first {
      font-size:px2rem(12);
      /*color:rgba(154,170,186,1);*/
      color: $progressSpan;
    }
    .progress__inner__span {
      font-family:Microsoft YaHei;
      font-weight:400;
      line-height:54px;
      color:rgba(0,152,255,1);
      font-size:13px;
    }
  }
  .progress__bottom {
    white-space:nowrap;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    /*left: 35.67px;*/
    top: 101px;
    font-size:18px;
    font-family:Microsoft YaHei;
    font-weight:400;
    line-height:26px;
    color:rgba(0,152,255,1);
  }
}
</style>
