    <template>
  <div class="registered text-center">
    <div>
      <img src="../../assets/loginImages/logo.png" />
    </div>
    <h2>您已注册过星云账号，可点击按钮继续</h2>
    <div>
      <el-button>申请加入</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'registered',
  data() {
    return {
      labelPosition: 'left',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      }
    };
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  }
};
</script>
    <style lang="scss" scoped>
.registered {
  position: relative;
  width: 98vw;
  height: 98vh;
  background: $bgColor;
  margin: 0 auto;
  img {
    margin-top: px2rem(200);
  }
  h2 {
    color: $font;
    display: inline-block;
    font-size: px2rem(28);
    font-weight: bold;
    margin: px2rem(50) 0;
  }
  .el-button {
    width: px2rem(200);
    color: $bor;
    margin: px2rem(20) px2rem(20) px2rem(20) 0;
  }
}
</style>
