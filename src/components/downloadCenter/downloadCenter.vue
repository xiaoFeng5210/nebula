<template>
    <div class="g__box">
      <div class="title">下载中心</div>
      <div class="subheading">
        <div class="logo"></div>
        模型提取工具：</div>
      <div class="m__container">
        <div class="m__item__list">
          <el-row>
            <el-col :span="4">
              <div class="m__img"><img src="../../assets/downloadCenter/revit.png" width="100%" alt=""></div>
            </el-col>
            <el-col :span="13">
              <div class="item__title">虫洞 （WormHole Exporter） Revit版 v 1.0.0</div>
              <div class="m__content" style="margin-top: 25px;">支持64位，适用 Revit 2016至2020</div>
              <div class="m__see"><a href="">查看详细</a></div>
            </el-col>
            <el-col :span="7">
              <el-button type="primary">下载</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="m__item__list">
          <el-row>
            <el-col :span="4">
              <div class="m__img"><img src="../../assets/downloadCenter/blackhole.png" width="100%" alt=""></div>
            </el-col>
            <el-col :span="13">
              <div class="item__title">虫洞（WormHole Exporter ） IFC版 V 1.0.0</div>
              <div class="m__content" style="margin-top: 25px;">非插件，可独立运行版本</div>
              <div class="m__see"><a href="">查看详细</a></div>
            </el-col>
            <el-col :span="7">
              <el-button type="primary">下载</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="m__item__list">
          <el-row>
            <el-col :span="4">
              <div class="m__img"><img src="../../assets/downloadCenter/Bentley-03.png" width="100%" alt=""></div>
            </el-col>
            <el-col :span="13">
              <div class="item__title">虫洞（WormHole Exporter ） Bentley版 V1.1.0</div>
              <div class="m__content">支持MicroStation CONNECT Edition（简称MicroStation CE）软件</div>
              <div class="m__content__line">支持提取DGN文件和I.DGN文件</div>
              <div class="m__see"><a href="">查看详细</a></div>
            </el-col>
            <el-col :span="7">
              <el-button type="primary">下载</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="m__item__list">
          <el-row>
            <el-col :span="4">
              <div class="m__img"><img src="../../assets/downloadCenter/3dsmax.png.png" width="100%" alt=""></div>
            </el-col>
            <el-col :span="13">
              <div class="item__title">虫洞（WormHole Exporter ）3Ds Max版 V1.1.0</div>
              <div class="m__content" style="margin-top: 25px;">支持3dsmax2010到3dsmax2020</div>
              <div class="m__see"><a href="">查看详细</a></div>
            </el-col>
            <el-col :span="7">
              <el-button type="primary">下载</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
<!--      编辑器部分-->
      <div class="subheading">
        <div class="logo"></div>
        编辑器下载：</div>
      <div class="m__container">
        <div class="m__item__list">
          <el-row>
            <el-col :span="4">
              <div class="m__img"><img src="../../assets/downloadCenter/RE-01.png" width="100%" alt=""></div>
            </el-col>
            <el-col :span="13">
              <div class="item__title">虫洞编辑器 (WormHole Editor)v 1.2.0</div>
              <div class="m__content" style="margin-top: 25px;">可进行模型数据（模型、矢量、倾斜模型、地形）的整合、编辑、处理</div>
              <div class="m__see"><a href="">查看详细</a></div>
            </el-col>
            <el-col :span="7">
              <el-button type="primary">下载</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'downloadCenter'
};
</script>

<style scoped lang="scss">
.g__box {
  width: 80%;
  margin-top: 30px;
  margin-left: 50%;
  transform: translateX(-50%);
  .logo {
    display: inline-block;
    vertical-align: middle;
    width:3px;
    height:15px;
    background:rgba(55,89,160,1);
    opacity:1;
  }
  .title {
    font-weight: bold;
    font-size: 22px;
  }
  .subheading {
    line-height:10px;
    font-weight: bold;
    margin-top: 30px;
    margin-left: 25px;
    font-size: 17px;
  }
  .m__container {
    width: 90%;
    margin-top: 30px;
    margin-left: 50%;
    transform: translateX(-50%);
    .m__item__list {
      font-size: 16px;
      margin-bottom: 20px;
      .m__see {
        margin-top: 10px;
        font-size: 14px;
      }
    }
    .m__img {
      margin-left: 45px;
      width: 95px;
      height: 95px;
    }
    .item__title, .m__content, .m__content__line  {
      font-size:14px;
      font-weight: 400;
    }
    .m__content{
      margin-top: 15px;
    }
    /deep/ .el-button {
      margin-top: 13%;
      transform: translateY(-50%);
    }
  }
}
</style>
