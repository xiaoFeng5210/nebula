<template>
  <div class="g__container">
    <div class="g__box">
      <div class="title">当前组织：{{companyPojo.companyName}}</div>
      <div class="create__info">
        <div class="create__date">
          <span>创建时间：</span>
          <span>{{companyPojo.createTime}}</span>
        </div>
        <div class="create__name">
          <span>创建人：</span>
          <span>{{companyPojo.createUserName}}</span>
        </div>
      </div>
      <div class="set__meal">
        <span>套餐名称：</span>
        <span>{{packagePojo.serviceAias}}</span>
      </div>
      <div class="m__container">
        <div class="item__container">
          <div class="item__container__title">空间</div>
          <div class="item__box">
            <div class="item__box__left">
              <div class="first__line">{{Math.round(packagePojo.cloudDiskSpaceRsedSize/1024/1024/1024)}}/{{Math.round(packagePojo.cloudDiskSpaceSize/1024/1024/1024)}}G</div>
              <div class="second__line">有效期：{{packagePojo.validDateNum}}天</div>
              <div class="item__button">续约/加餐</div>
            </div>
            <div class="item__box__right">
              <SetMealChart />
            </div>
          </div>
        </div>
        <div class="item__container">
          <div class="item__container__title">项目</div>
          <div class="item__box">
            <div class="item__box__left">
              <div class="first__line" style="font-size:14px;">已创建{{packagePojo.projectRsedNum}}个</div>
              <div class="second__line" style="font-size:14px;">限制数量{{packagePojo.projectNum}}个</div>
              <div class="item__button">续约/加餐</div>
            </div>
            <div class="item__box__right">
              <SetMealChart :labelShow="false"/>
            </div>
          </div>
        </div>
<!--        模型-->
        <div class="item__container">
          <div class="item__container__title">模型</div>
          <div class="item__box item__model">
            <div><RinglikeProgress bottomData="7.6G" firstLine="已转换" second-line="35" /></div>
            <div style="margin-left: 63px">
              <RinglikeProgress bottomData="14.2G" firstLine="已上传" second-line="47"/></div>
          </div>
        </div>
      </div>
      <div class="m__container">
        <div class="item__container">
          <div class="item__container__title">成员</div>
          <div class="item__box item__model" style="margin-left:126px;">
            <div><RinglikeProgress bottomData="15/50人" firstLine="在线" second-line="8" /></div>
          </div>
        </div>
        <div class="item__container" style="width: 381px;">
          <div class="item__container__title">文件</div>
          <div class="item__box">
            <div class="item__file__right">
              <div class="file__first__line">
                <img src="../../assets/businessManagement/dwg.png" alt="" class="file__img">
                <span class="file__number">{{packagePojo.docDwgNum}} 个</span>
                <img src="../../assets/businessManagement/pdf.png" alt="" class="file__img">
                <span class="file__number">{{packagePojo.docPdfNum}} 个</span>
              </div>
              <div class="file__first__line">
                <img src="../../assets/businessManagement/xls.png" alt="" class="file__img">
                <span class="file__number">{{packagePojo.docExcelNum}} 个</span>
                <img src="../../assets/businessManagement/doc.png" alt="" class="file__img">
                <span class="file__number">{{packagePojo.docWordNum}} 个</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SetMealChart from './setMealChart';
import RinglikeProgress from './ringlikeProgress';
import { getPackageDetailsUsageS } from '../../api/companyApi/company';
import { companyFindById } from '../../api/comingApi/coming';

export default {
  name: 'roleManage',
  components: {
    SetMealChart,
    RinglikeProgress
  },
  data() {
    return {
      queryData: {
        companyId :localStorage.getItem('companyId')
      },
      packagePojo:{},
      companyPojo:{}
    };
  },
  mounted() {
    this.getPackageDetailsUsageS();
    this.companyFindById();
  },
  methods: {
    companyFindById() {
      const t = this;
      companyFindById({id:t.queryData.companyId}).then(res => {
        if (res.code === 200 && res.data) {
          console.log(res.data);
          t.companyPojo = res.data;
        }
      });
    },
    getPackageDetailsUsageS() {
      const t = this;
      getPackageDetailsUsageS(t.queryData.companyId).then(res => {
        if (res.code === 200 && res.data) {
          t.packagePojo = res.data;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.g__container {
  padding-top: 26px;
  width: 100%;
  height: 100%;
  background:rgba(255,255,255,1);
  box-shadow:0px 3px 6px rgba(0,0,0,0.14);
  opacity:1;
}
.g__box {
  /*margin-top: 26px;*/
  margin-left: 20px;
  .title {
    font-size:16px;
    font-family:Microsoft YaHei;
    font-weight:bold;
    line-height:21px;
    color:rgba(102,102,102,1);
    opacity:1;
  }
  .create__info {
    margin-top: 18px;
    display: flex;
    font-size:14px;
    line-height:20px;
    color:rgba(34,42,45,1);
    .create__name {
      margin-left: 60px;
    }
  }
  .set__meal {
    margin-top: 35px;
    font-size:14px;
    font-weight:normal;
    line-height:20px;
    color:rgba(55,89,160,1);
  }
  .m__container {
    display: flex;
    margin-top: 20px;
    .item__container {
      margin-right: 40px;
      width:425px;
      height:216px;
      border:1px solid rgba(212,215,216,1);
      opacity:1;
      border-radius:4px;
      .item__model {
        margin-top: 12px;
        margin-left: 48px;
        /deep/ .el-progress__text {
          display: none;
        }
      }
      .item__container__title {
        margin-top: 13px;
        margin-left: 20px;
        font-size:16px;
        font-family:Microsoft YaHei;
        font-weight:bold;
        line-height:21px;
        color:rgba(102,102,102,1);
      }
      .item__box {
        display: flex;
        .item__box__left {
          margin-top: 37px;
          margin-left: 65px;
          .first__line {
            font-size:18px;
            font-family:Microsoft YaHei;
            font-weight:bold;
            line-height:24px;
            color:rgba(102,102,102,1);
          }
          .second__line {
            margin-top: 16px;
            font-size:14px;
            font-weight:normal;
            line-height:20px;
            color:rgba(76,73,91,1);
          }
          .item__button {
            margin-left: -44px;
            margin-top: 22px;
            text-align: center;
            width:89px;
            height:38px;
            font-size:14px;
            background-color: #F1F2F7;
            border-radius:5px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            line-height:38px;
            color:rgba(55,89,160,1);
            opacity:1;
          }
        }
        .item__box__right {
          margin-top: -20px;
          margin-left: 52px;
          width:173px;
          height:173px;
          opacity:1;
        }
        .item__file__right {
          display: flex;
          width:203px;
          height:200px;
          margin-top: 1px;
          margin-left: 10px;
          .file__first__line {
            height: 46.33px;
            line-height: 46.33px;
            .file__number {
              vertical-align: top;
            }
            .file__img__second {
              margin-left: 20px;
            }
            .file__img__third {
              margin-right: -20px;
            }
            .file__img {
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
