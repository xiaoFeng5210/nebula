<template>
  <div id="app" class="app">
    <commonHead v-if="islog" v-show="fullscreen"></commonHead>
    <router-view />
    <div ref="overTime" class="long-time" :class="{'hide':isactive}">
      <div class="cover"></div>
      <div class="overtime bg-white">
        <div class="tops">
          <img src="../src/assets/icon/overtime.png" />
          <span class="msg">您已经很长时间没有做任何操作了！</span>
        </div>
        <div class="bots text-right">
          <el-button size="mini" plain type="danger" @click="logins">刷新</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { removeToken } from '@/utils/auth';
export default {
  name: 'App',
  data() {
    return {
      startTime: 0,
      isactive: true,
      islog:false,
      fullscreen:true
    };
  },
  created() {
    this.startTime = new Date().getTime();
  },
  mounted() {
    const _this = this;
    // window.setInterval(_this.tTime, 1000);
    window.addEventListener('click', _this.clickOther, true);
  },
  methods: {
    clickOther() {
      // const clickTime = new Date().getTime();
      // const interval = (clickTime - this.startTime) / (1000 * 60);
      // const body = document.body;
      // console.log(interval);
      // if (interval > 0.3) {
      //   body.style.overflow = 'hidden';
      //   this.isactive = false;
      // } else {
      this.startTime = new Date().getTime();
      // }
    },
    tTime() {
      const tOut = 30 * 60 * 1000; // 超时时间30min
      const clickTime = new Date().getTime();
      const body = document.body;
      if (clickTime - this.startTime > tOut) {
        body.style.overflow = 'hidden';
        this.isactive = false;
      }
    },
    logins() {
      const body = document.body;
      body.style.overflow = 'auto';
      document.removeEventListener('click', this.clickOther, true);
      this.isactive = true;
      this.$router.replace({ path: '/' });
      removeToken('token');
    }
  },
  computed: {
    msg() {
      return this.$store.state.user.fullscreen;
    }
  },
  watch: {
    $route: function(val) {
      if (val.name === 'index' || val.name === '/' || val.name === 'login'|| val.name === 'invite') {
        this.islog = false;
      } else {
        this.islog = true;
      }
    },
    msg() {
      this.fullscreen = !this.fullscreen;
    }
  }
};
</script>
<style lang="scss">
.app {
  overflow: hidden;
  .long-time {
    position: absolute;
    top: 0;
    left: 0;
  }
  .cover {
    width: 100vw;
    height: 100vh;
    position: absolute;
    background: $deepGre;
    opacity: 0.3;
    z-index: 1000;
  }
  .overtime {
    width: px2rem(350);
    height: px2rem(155);
    border-radius: px2rem(5);
    padding: px2rem(20);
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1001;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 px2rem(20) rgba($color: #a1a0a0, $alpha: 0.3);
    .tops {
      margin-top: px2rem(30);
      font-size: px2rem(16);
      img {
        width: px2rem(28);
        height: px2rem(26);
        position: absolute;
      }
      .msg {
        display: inline-block;
        margin-left: px2rem(35);
        margin-top: px2rem(6);
      }
    }
    .bots {
      margin-top: px2rem(20);
    }
  }
  .hide {
    display: none;
  }
  .hides {
    display: block;
  }
}
</style>
