<template class="engin">
  <div class="emscripten_border" id="emscripten" v-loading="loading">
    <canvas class="emscripten" id="canvas" oncontextmenu="event.preventDefault()" tabindex="1"></canvas>
    <div class="loadings" v-if="showCom">
      <div class="ComName">
        <el-row>
          <el-col :span="21">{{ComName}}</el-col>
          <el-col :span="3">{{progress}}%</el-col>
        </el-row>
      </div>
      <el-progress
        class="progressbar"
        id="loading"
        :text-inside="false"
        :stroke-width="15"
        :percentage="progress"
      ></el-progress>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      progress: 0,
      showCom: true,
      ComName: ''
    };
  },
  created() {
    // 已经进过模型
    const _this = this;
    _this.open();
  },
  mounted() {},
  methods: {
    open() {
      const _this = this;
      _this.createScript('js/main.js', 'main');
      _this.createScript('js/RealBIMWeb.js', 'RealBIMWeb', true);
      _this.createScript('js/ReUtility_2.1.0.940.js', 'ReUtility', true);
      // 辅助监听事件，返回值为当前模型加载的进度
      document.addEventListener('RealBIMLoadProgress', function(e) {
        _this.loading = false;
        _this.progress = e.detail.progress;
        const msg = [
          '开始加载三维模型',
          '引擎渲染器加载',
          '开始资源预加载',
          '加载主相机',
          '加载版本数据',
          '数据加载完成...'
        ];
        const len = e.detail.info.length;
        if (_this.progress === 0) {
          _this.ComName = msg[0];
        } else if (_this.progress === 10) {
          _this.ComName = msg[1];
        } else if (_this.progress === 12) {
          _this.ComName = msg[2];
        } else if (_this.progress === 10) {
          _this.ComName = msg[3];
        } else if (_this.progress < 100) {
          _this.ComName = msg[4] + e.detail.info.substring(len - 6, len);
        } else {
          _this.ComName = msg[5];
          _this.showCom = false;
        }
      });
    },
    // 创建模型需要的文件
    createScript(src, id, isAsync) {
      const script = document.createElement('script');
      if (isAsync) {
        script.setAttribute('async', 'async');
      }
      script.src = src;
      script.setAttribute('id', id);
      const body = document.querySelector('body');
      body.append(script);
    },
    removeScript(id) {
      const body = document.querySelector('body');
      if (document.getElementById(id)) {
        body.removeChild(document.getElementById(id));
      }
    },
    close() {
      this.removeScript('RealBIMWeb');
      this.removeScript('ReUtility');
      this.removeScript('main');
    }
  },
  beforeDestroy() {
    window.onresize = null;
  }
};
</script>
<style lang="scss" scoped>
.engin {
  width: 100%;
  height: 100%;
}
.emscripten {
  width: 100%;
  height: 100%;
  background: #000;
}
.emscripten_border {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .loadings {
    width: px2rem(400);
    height: px2rem(150);
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 20px rgb(216, 216, 216);
    .progressbar {
      width: px2rem(380);
      margin: 0 auto;
      .el-progress__text {
        display: none;
      }
      .el-progress-bar {
        padding: 0;
        margin: 0;
        .el-progress-bar__outer {
          border-radius: px2rem(5);
          .el-progress-bar__inner {
            border-radius: px2rem(5);
          }
        }
      }
    }
    .ComName {
      color: gray;
      text-align: left;
      margin-top: px2rem(10);
      padding: px2rem(20) px2rem(14);
      border-radius: px2rem(30);
    }
  }
}
</style>
