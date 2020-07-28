<template>
  <div class="Fees text-center">
    <commonHead></commonHead>
    <div class="Fees-container">
      <div class="top-text">
        <h2 class="text-primary">选择适合您的版本</h2>
        <p class="text-grey">当前组织：秉匠科技</p>
      </div>
      <div class="container">
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4" class="box-card">
            <div class="top-title head1">
              <h4 class="text-white">团队版</h4>
              <p class="text-white">适用于任何规模的企业或团队</p>
            </div>
            <div class="piece text-dark">
              <ul v-for="(item,index) in TeamEdition " :key="index">
                <li v-if="item==1">
                  <img src="../../assets/icon/right.png" />
                </li>
                <li v-else-if="item==0">
                  <img src="../../assets/icon/left.png" />
                </li>
                <li v-else>{{item}}</li>
              </ul>
            </div>
            <div class="bottom">
              <div class="bottom-div">
                ¥
                <span class="text-dark">9900</span>/年
              </div>
              <div class="bottom-div">
                ¥
                <span>825</span>/月
              </div>
              <div class="bottom-div">
                <img src="../../assets/icon/gift.png" />赠送15人用户礼包
              </div>
              <el-button type="primary" plain>立即购买</el-button>
            </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4" class="box-card">
            <div class="top-title head2">
              <h4 class="text-white">企业版</h4>
              <p class="text-white">适用于专业研发管理、高级项目管理等</p>
            </div>
            <div class="piece text-dark">
              <ul v-for="(item,index) in EntpEdition " :key="index">
                <li v-if="item=='1'">
                  <img src="../../assets/icon/right.png" />
                </li>
                <li v-else-if="item=='0'">
                  <img src="../../assets/icon/left.png" />
                </li>
                <li v-else>{{item}}</li>
              </ul>
            </div>

            <div class="bottom">
              <div class="bottom-div">
                ¥
                <span class="text-dark">19900</span>/年
              </div>
              <div class="bottom-div">
                ¥
                <span>825</span>/月
              </div>
              <div class="bottom-div">
                <img src="../../assets/icon/gift.png" />赠送15人用户礼包
              </div>
              <el-button type="primary" plain>立即购买</el-button>
            </div>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="4" class="box-card">
            <div class="top-title head3">
              <h4 class="text-white">旗舰版</h4>
              <p class="text-white">适用于专业研发管理、高级项目管理等</p>
            </div>
            <div class="piece text-dark">
              <ul v-for="(item,index) in flhpEdition " :key="index">
                <li v-if="item==1">
                  <img src="../../assets/icon/right.png" />
                </li>
                <li v-else-if="item==0">
                  <img src="../../assets/icon/left.png" />
                </li>
                <li v-else>{{item}}</li>
              </ul>
            </div>

            <div class="bottom">
              <div class="bottom-div">
                ¥
                <span class="text-dark">39900</span>/年
              </div>
              <div class="bottom-div">
                ¥
                <span>825</span>/月
              </div>
              <div class="bottom-div">
                <img src="../../assets/icon/gift.png" />赠送15人用户礼包
              </div>
              <el-button type="primary" plain>立即购买</el-button>
            </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4" class="box-card card4">
            <div class="top-title head4">
              <h4 class="text-white">应用定制</h4>
              <p class="text-white">根据贵公司需求量身定制</p>
            </div>
            <div class="piece text-dark">
              <ul v-for="(item,index) in custEdition " :key="index">
                <li>{{item}}</li>
              </ul>
            </div>

            <div class="bottom">
              <div class="bottom-div">
                ¥
                <span class="text-dark">39900</span>/年
              </div>
              <div class="bottom-div">
                ¥
                <span>825</span>/月
              </div>
              <div class="bottom-div">
                <img src="../../assets/icon/gift.png" />赠送15人用户礼包
              </div>
              <el-button type="primary" plain>立即购买</el-button>
            </div>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Fees',
  data() {
    return {
      TeamEdition: [
        '100个',
        '10万行',
        '5万次/月',
        '1',
        '1800元/年',
        '1',
        '0',
        '300元/人/年',
        '100元/1万次剩余月余'
      ],
      EntpEdition: [
        '不限',
        '100万行',
        '10万次/月',
        '1',
        '1800元/年',
        '1',
        '1',
        '300元/人/年',
        '100元/1万次剩余月余'
      ],
      flhpEdition: [
        '不限',
        '不限',
        '20万次/月',
        '1',
        '1800元/年',
        '1',
        '1',
        '300元/人/年',
        '100元/1万次剩余月余'
      ],
      custEdition: [
        '顾问为您按需搭建业务定制应用包。',
        ' 包括销售、营销、生成、研发、运营等业 务环节。',
        ' 配置自动化工作流，帮你大幅度降低人工 成本。'
      ]
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
.Fees {
  .Fees-container {
    position: relative;
    width: 98vw;
    height: 92vh;
    background: $bgColor;
    margin: 0 auto;
    .top-text {
      h2 {
        display: inline-block;
        font-size: px2rem(35);
        font-weight: bold;
        margin: px2rem(50) 0 0 0;
      }
      .text-grey {
        margin-top: px2rem(30);
        font-size: px2rem(16);
      }
    }
    .container {
      margin-top: px2rem(50);
      .box-card {
        border-radius: px2rem(10);
        box-shadow: 0 0 px2rem(10) $bor;
        .head1 {
          background-image: linear-gradient(
            to right,
            $leftColor1,
            $rightColor1
          );
        }
        .head2 {
          background-image: linear-gradient(
            to right,
            $leftColor2,
            $rightColor2
          );
        }
        .head3 {
          background-image: linear-gradient(
            to right,
            $leftColor3,
            $rightColor3
          );
        }
        .head4 {
          background-image: linear-gradient(
            to right,
            $leftColor4,
            $rightColor4
          );
        }
        .top-title {
          padding: px2rem(20);
          border-top-left-radius: px2rem(10);
          border-top-right-radius: px2rem(10);
          h4 {
            font-size: px2rem(20);
          }
          p {
            font-size: px2rem(14);
          }
        }
        .piece {
          ul {
            li {
              list-style: none;
              margin: px2rem(20);
              font-size: px2rem(13);
              img {
                width: px2rem(15);
                height: px2rem(15);
              }
            }
          }
        }
        .bottom {
          width: 80%;
          display: inline-block;
          margin: px2rem(10) px2rem(20) px2rem(50) px2rem(20);
          border-top: px2rem(1) solid $greyClolor;
          .bottom-div {
            margin: px2rem(20) 0;
            font-size: px2rem(13);
            img {
              width: px2rem(13);
              height: px2rem(13);
              margin: 0 px2rem(5);
            }
            .text-dark {
              font-size: px2rem(35);
              font-weight: bold;
            }
          }
          .el-button {
            width: 80%;
            margin-top: px2rem(30);
            padding: px2rem(10) px2rem(20);
          }
        }
      }
      .card4 {
        .piece {
          margin: px2rem(129.5) auto;
        }
      }
      .el-col {
        border: px2rem(1) solid $bgColor;
      }
      .el-col-1,
      .el-col-2 {
        width: 6.5% !important;
      }
    }
  }
}
</style>
