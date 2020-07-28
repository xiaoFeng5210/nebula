<template>
  <div class="panorama">
    <suspen
      ref="suspen"
      @tabindex="tabindex"
      @handle="handle"
      @setFont="setFont"
      @setColor="setColor"
      v-show="brief"
    ></suspen>
    <div class="fiexd-top" v-show="brief">
      <el-button class="btn-fullscreen el-icon-rank" @click="handleFullScreen"></el-button>
      <i class="center">按下[ESC] 退出全屏</i>
    </div>
    <postil ref="postil" @newpano="newpano" v-if="ispano==1"></postil>
    <TagBox class="tagbox" v-if="ispano==2" @showList="showList" @close-tagbox="closeTagBox"/>
    <viewport
      v-if="ispano==3"
      @showList="showList"
      @close-tagbox="closeTagBox"
      @show-model="showModel"
    ></viewport>
    <fabric
      v-show="isfabric"
      ref="fabrics"
      :imgUrl="imgUrl"
      :fabricF="fabricF"
      :fabricC="fabricC"
      @savesImg="savesImg"
    ></fabric>
    <div id="modelBox" @mouseup="clickAttribute" v-show="!isfabric&&brief"></div>
    <newpostil
      v-if="newpostils"
      @closepostil="closepostil"
      :obj="obj"
      :coordinatesL="coordinatesL"
      :imgList="imgList"
      :buildId="buildId"
    ></newpostil>
    <!-- <div id="lab">
      <div>新建公告</div>
      <div>属性信息</div>
    </div>-->
  </div>
</template>
<script>
import suspen from './suspen';
import fabric from './fabric';
import TagBox from './tagBox';
import postil from './postilModule/postil';
import viewport from './viewport';
import newpostil from './newpostil';
import aes from '@/utils/aes';
import { upload } from '@/api/user';
export default {
  name: 'panorama',
  components: {
    suspen,
    fabric,
    postil,
    viewport,
    TagBox,
    newpostil
  },
  data() {
    return {
      companyId: localStorage.getItem('companyId'),
      imgUrl: '',
      isfabric: false,
      ispano: 0,
      isViewport: false,
      fabricF: '',
      fabricC: '',
      istag: false,
      brief: true,
      newpostils: false,
      imgList: [],
      coordinatesL: [],
      obj: '',
      buildId:0
    };
  },
  created() {},
  mounted() {
    const that = this;
    that.$nextTick(() => {
      const canvasModel = document.getElementById('model');
      canvasModel.style.display = 'block';
      const modelBox = document.getElementById('modelBox');
      modelBox.append(canvasModel);
      document.addEventListener('keyup', function(e) {
        // 此处填写你的业务逻辑即可
        if (e.keyCode === 27) {
          that.$store.dispatch('user/toogle', 1);
          g_re_em_window_width = window.innerWidth;
          g_re_em_window_height = window.innerHeight;
        } else if (e.keyCode === 122) {
          g_re_em_window_width = window.innerWidth;
          g_re_em_window_height = window.innerHeight;
        }
      });
    });
    document.addEventListener('RealBIMSelModel', this.getCurrentProject);
  },
  methods: {
    handleFullScreen() {
      this.$store.dispatch('user/toogle', 0);
    },
    tabindex(num) {
      this.ispano = num;
    },
    closeTagBox() {
      this.ispano = 0;
    },
    newpano(num) {
      switch (num) {
      case 1:
        this.$refs.suspen.isShow = true;
        break;
      case 2:
        this.brief = false;
        this.$refs.suspen.isShow = false;
        break;
      case 3:
        this.$refs.suspen.isShow = false;
        this.brief = true;
        break;
      case 4:
        this.$refs.suspen.isShow = false;
        this.ispano = 0;
        break;
      default:
        break;
      }
    },
    handle(objs) {
      this.imgUrl = '';
      if (objs === 'cancel') {
        this.isfabric = false;
        this.$refs.fabrics.clearC();
      } else if (objs === 'finish') {
        this.isfabric = false;
        this.$refs.fabrics.saveFile();
      } else {
        this.imgUrl = REgetScreenPrintImage();
        this.coordinatesL = REgetCamLocation();
        this.isfabric = true;
        this.$refs.fabrics.drawTypeChange(objs);
      }
    },
    setFont(fon) {
      this.fabricF = fon;
    },
    setColor(clr) {
      this.fabricC = clr;
    },
    showList(num) {
      if (num === 1) {
        this.brief = false;
      } else if (num === 2) {
        this.brief = true;
      }
    },
    savesImg(imgData) {
      const _this = this;
      const imgs = aes.base64ToBlob(imgData);
      const formdata = new FormData();
      formdata.append('companyId', this.companyId);
      formdata.append('file', imgs);
      // 获取视口图片的地址
      upload(formdata).then(res => {
        if (res.code === 200) {
          _this.imgList.push(res.data.fileId);
          _this.newpostils = true;
        }
      });
    },
    clickAttribute() {
      // const lab = document.getElementById('lab');
      // lab.style.top = val.x + 'px';
      // lab.style.left = val.y + 'px';
      // console.log(val);
    },
    closepostil(val) {
      if (val.postilName) {
        this.obj = JSON.stringify(val);
        this.newpostils = false;
      } else if (val === 'getList') {
        this.$refs.postil.getList();
        this.imgUrl = '';
        this.imgList = [];
        this.coordinatesL = [];
        this.$refs.suspen.isShow = false;
        this.newpostils = false;
      } else if (val === '') {
        this.imgUrl = '';
        this.obj = '';
        this.imgList = [];
        this.coordinatesL = [];
        this.$refs.suspen.isShow = false;
        this.newpostils = false;
      }
    },
    showModel() {
      this.brief = true;
    },
    getCurrentProject() {
      const proberet = REgetCurProbeRet(); // 构件信息
      const ids = proberet.m_uSelActorSubID_L32;
      this.buildId = ids;
    }
  },
  beforeRouteLeave(to, from, next) {
    const canvasModel = document.getElementById('model');
    if (canvasModel) {
      canvasModel.style.display = 'none';
      const body = document.querySelector('body');
      body.append(canvasModel);
    }
    next();
  }
};
</script>

<style lang="scss" scoped>
.panorama {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .fiexd-top {
    width: px2rem(400);
    position: fixed;
    right: 0;
    z-index: 1000;
  }
  #modelBox {
    // position: relative;
    width: 100%;
    height: 100%;
  }
  #lab {
    background: $bgColor;
    position: absolute;
  }
}
</style>
