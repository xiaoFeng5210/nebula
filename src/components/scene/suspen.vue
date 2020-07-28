<template>
  <div class="suspen">
    <div class="top-center d-flex jc-start ai-center text-center">
      <div
        class="text-center tabs-m"
        v-for="(item,index) in titles"
        :key="index"
        @click="changetab(index+1)"
      >
        <div class="top-img" :class="item.cs"></div>
        <div class="top-title">{{item.name}}</div>
      </div>
    </div>
    <div
      v-show="isShow"
      @click="isfabric=true"
      class="toolbar d-flex jc-between ai-center text-center"
    >
      <div
        class="divi"
        v-for="i in 9"
        :key="i"
        :class="[actives==i ? 'icons-'+i : 'icon-'+i]"
        @click="Tabact(i)"
      ></div>
      <div>
        <el-button class="cancel" @click="cancel">取消</el-button>
      </div>
      <div>
        <el-button class="finish" @click="finish">完成</el-button>
      </div>
    </div>
    <div v-show="isShow" class="font-color d-flex jc-start ai-center text-center">
      <select class="selects text-center" v-model="selected" @change="selection">
        <option v-for="(items,k) in fonts" :key="k">{{items}}</option>
      </select>
      <div
        class="color-icon"
        v-for="(itmes,index) in colorS"
        :key="index"
        :style="{'background':itmes}"
        @click="choseColor(itmes)"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      titles: [
        { name: '批注', cs: 'postil' },
        { name: '标记', cs: 'scene' },
        { name: '视口', cs: 'viewport' }
      ],
      isShow: false,
      actives: 0,
      fonts: ['2', '4', '10'],
      colorS: ['#F6416C', '#FF993F', '#736EFE'],
      selected: '2'
    };
  },
  methods: {
    changetab(num) {
      this.$emit('tabindex', num);
    },
    Tabact(num) {
      this.actives = num;
      let objs = '1111';
      switch (num) {
      case 1:
        objs = 'pen';
        break;
      case 2:
        objs = 'cloud';
        break;
      case 3:
        objs = 'rectangle';
        break;
      case 4:
        objs = 'ellipse';
        break;
      case 5:
        objs = 'arrow';
        break;
      case 6:
        objs = 'text';
        break;
      case 7:
        objs = 'mosaic';
        break;
      default:
        objs = 'back';
        break;
      }
      this.$emit('handle', objs);
    },
    cancel() {
      this.isShow = false;
      this.$emit('handle', 'cancel');
    },
    finish() {
      this.$emit('handle', 'finish');
    },
    selection() {
      this.$emit('setFont', this.selected);
    },
    choseColor(clr) {
      this.$emit('setColor', clr);
    }
  }
};
</script>

<style lang="scss" scoped>
.suspen {
  width: 100%;
  position: fixed;
  z-index: 1000;
  .top-center {
    position: absolute;
    left: 37%;
    top: 5%;
    transform: translate(-37%, -5%);
    padding: px2rem(10);
    font-size: px2rem(12);
    margin-top: px2rem(20);
    color: $bgColor;
    border-radius: px2rem(5);
    background-color: $fixeBg;
    .tabs-m {
      width: px2rem(70);
      cursor: pointer;
      .top-img {
        width: px2rem(24);
        height: px2rem(24);
        margin: px2rem(4) auto;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .postil {
        background-image: url('../../assets/sceneImg/postil.png');
      }
      .scene {
        background-image: url('../../assets/sceneImg/scene.png');
      }
      .viewport {
        background-image: url('../../assets/sceneImg/viewport.png');
      }
    }
  }
  .toolbar {
    position: absolute;
    width: px2rem(540);
    height: px2rem(50);
    left: 37%;
    top: 5%;
    margin-top: px2rem(100);
    transform: translate(-37%, -5%);
    padding: px2rem(10);
    font-size: px2rem(12);
    border-radius: px2rem(5);
    background: $fixeBg;
    .divi {
      width: px2rem(25);
      height: px2rem(25);
      cursor: pointer;
      background-repeat: no-repeat;
      background-size: 80%;
      background-position: 50% 50%;
    }
    .el-button {
      font-size: px2rem(11);
      padding: px2rem(5) px2rem(8);
      border-radius: px2rem(2);
    }
    .cancel {
      color: $bgColor;
      background: $fixeBg !important;
    }
    .icon-1 {
      background-image: url('../../assets/sceneImg/1.png');
    }
    .icon-2 {
      background-image: url('../../assets/sceneImg/2.png');
    }
    .icon-3 {
      background-image: url('../../assets/sceneImg/3.png');
    }
    .icon-4 {
      background-image: url('../../assets/sceneImg/4.png');
    }
    .icon-5 {
      background-image: url('../../assets/sceneImg/5.png');
    }
    .icon-6 {
      background-image: url('../../assets/sceneImg/6.png');
    }
    .icon-7 {
      background-image: url('../../assets/sceneImg/7.png');
    }
    .icon-8 {
      width: px2rem(2);
      height: px2rem(30);
      background: $deepGre;
    }
    .icon-9 {
      background-image: url('../../assets/sceneImg/8.png');
    }
    .icons-1 {
      background-image: url('../../assets/sceneImg/a1.png');
    }
    .icons-2 {
      background-image: url('../../assets/sceneImg/a2.png');
    }
    .icons-3 {
      background-image: url('../../assets/sceneImg/a3.png');
    }
    .icons-4 {
      background-image: url('../../assets/sceneImg/a4.png');
    }
    .icons-5 {
      background-image: url('../../assets/sceneImg/a5.png');
    }
    .icons-6 {
      background-image: url('../../assets/sceneImg/a6.png');
    }
    .icons-7 {
      background-image: url('../../assets/sceneImg/a7.png');
    }
    .icons-9 {
      background-image: url('../../assets/sceneImg/a8.png');
    }
  }
  .font-color {
    position: absolute;
    width: px2rem(540);
    height: px2rem(50);
    left: 37%;
    top: 5%;
    margin-top: px2rem(136);
    transform: translate(-37%, -5%);
    .selects {
      width: px2rem(40);
      border: 0;
      appearance: none;
      font-size: px2rem(12);
      -moz-appearance: none;
      -webkit-appearance: none;
      background-size: 12px;
    }
    .color-icon {
      width: px2rem(30);
      height: px2rem(20);
      border: px2rem(2) solid $selfTitle;
    }
    .color-icon:hover {
      border: px2rem(2) solid $leftColor3;
    }
  }
}
</style>
