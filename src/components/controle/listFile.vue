<template>
  <div ref="listFlie" class="listFlie d-flex jc-start ai-start wr-wrap">
    <div class="img-title" v-for="(a,index) in tableData" :key="index" @mouseup="clickAttribute">
      <div class="img">
        <img src="../../assets/new.png" />
      </div>
      <div class="title text-center">logo</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'listFlie',
  props: {
    datas: Array
  },
  data() {
    return {
      tableData: []
    };
  },
  mounted() {
    this.$refs.listFlie.oncontextmenu = function () { return false; };
    this.tableData = this.$props.datas;
  },
  methods:{
    clickAttribute() {
      console.log('23232312');
    }
  }
};
</script>

<style lang="scss" scoped>
.listFlie {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .img-title {
    width: px2rem(150);
    margin-top: px2rem(30);
    margin-left: px2rem(21);
    img {
      width: 100%;
      height: 90%;
    }
  }
}
</style>
