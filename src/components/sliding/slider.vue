<template>
  <div class="container">
    <!-- 验证码 -->
    <div ref="captcha" id="captcha"></div>
    <!-- 验证结果 -->
    <div id="msg"></div>
  </div>
</template>

<script>
import ImgCode from './slideBlocks.js';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    const self = this;
    this.$nextTick(function() {
      const PureFull = new ImgCode();
      PureFull.init({
        el: self.$refs.captcha,
        onSuccess: this.onSuccess,
        onFail: this.onFail,
        onRefresh: this.cleanMsg
      });
    });
  },
  methods: {
    onSuccess() {
      this.$emit('onSuccess');
      // 后台登录认证
    },
    onFail() {
      // console.log('失败');
      // this.$emit('onFail');
    },
    cleanMsg() {
      // console.log('刷新');
    }
  }
};
</script>

<style scoped lang="scss">
@import './slideBlock.css';
.container {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
#captcha{
  position: relative;
  width: px2rem(380);
  margin: 0 auto;
}
</style>
