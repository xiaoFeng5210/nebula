<template>
  <el-dialog title="切换企业" :visible.sync="enterpriseDialog" width="25%" :modal="false">
    <div class="dialog_box">
      <div
        v-for="(item, index) in company"
        :key="index"
        :class="[{ showBg: index === isActive }, 'd-flex', 'jc-between']"
        @mouseenter="enter(index)"
        @mouseleave="leave()"
        @click="tabshow(item)"
      >
        <div class="font_color">
          <span>{{ item.companyName }}</span>
          <span v-if="item.due" class="deadLine">（已到期）</span>
          <span v-else-if="item.currentCompany" class="currentC">（当前企业）</span>
          <span v-else></span>
        </div>
        <div v-show="seen && index == current">
          <img src="../../assets/icon/icon_right.png" />
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="innitee">
      <el-button type="primary" @click="createCompany">创建企业</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'transform',
  data() {
    return {
      enterpriseDialog: false,
      isActive: false, // 切换企业弹窗动态添加背景样式
      seen: false, // 控制切换企业箭头的显示隐藏
      current: 0 // 控制切换企业箭头的显示隐藏
    };
  },
  props: {
    company: Array,
    innitee: Boolean
  },
  methods: {
    enterpriseVisible() {
      this.enterpriseDialog = true;
    },
    // 跳转到创建企业页面
    createCompany() {
      this.$emit('chageshow');
      this.$router.push({ path: '/coming' });
    },
    tabshow(item) {
      this.$emit('chageshow', item);
    },
    // 鼠标移进
    enter(index) {
      this.seen = true;
      this.isActive = index;
      this.current = index;
    },
    // 鼠标移出
    leave() {
      this.seen = false;
      this.isActive = null;
      this.current = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dialog {
  .showBg {
    background-color: $scene_bg;
    color: $bluebor;
    cursor: pointer;
  }
  .font_color {
    .deadLine {
      color: $absColor;
    }
    .currentC {
      color: $bluebor;
    }
  }
}
</style>
