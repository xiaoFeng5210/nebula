<template>
  <div class="personSet bg-white">
    <el-main>
      <div class="setHeader bg-white d-flex jc-between ai-center">
        <div class="lefts d-flex jc-between ai-center">
          <div class="line"></div>
          <div class="titles">项目人员</div>
        </div>
        <div class="rights bg-white d-flex jc-between ai-center">
          <el-button v-if="clicktype==='save'" type="primary" @click="handleClick('edit')">编辑</el-button>
          <el-button v-if="clicktype==='edit'" type="primary" @click="handleClick('save')">保存</el-button>
        </div>
      </div>
      <div class="table bg-white">
        <el-form ref="form" :model="prodata">
          <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item title="项目名称" name="1">
              <el-form-item label>
                <el-input v-if="clicktype==='edit'" v-model="prodata.projectName"></el-input>
                <span v-else>{{prodata.projectName||'暂无'}}</span>
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="基本信息" name="2">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="项目地点：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectLocation"></el-input>
                    <span v-else>{{prodata.projectLocation||'暂无'}}</span>
                  </el-form-item>
                  <el-form-item label="计划开工日期：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectPlanStartTime"></el-input>
                    <span v-else>{{prodata.projectPlanStartTime||'暂无'}}</span>
                  </el-form-item>
                  <el-form-item label="计划完工日期：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectPlanEndTime"></el-input>
                    <span v-else>{{prodata.projectPlanEndTime||'暂无'}}</span>
                  </el-form-item>
                  <el-form-item label="计划总工期：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectPlanWorkDay"></el-input>
                    <span v-else>{{prodata.projectPlanWorkDay||'暂无'}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="实际开工日期：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectActualStartTime"></el-input>
                    <span v-else>{{prodata.projectActualStartTime||'暂无'}}</span>
                  </el-form-item>
                  <el-form-item label="实际完工日期：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectActualEndTime"></el-input>
                    <span v-else>{{prodata.projectActualEndTime||'暂无'}}</span>
                  </el-form-item>
                  <el-form-item label="工程类型：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectCategory"></el-input>
                    <span v-else>{{prodata.projectCategory||'暂无'}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="工程状态：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectStatus"></el-input>
                    <span v-else>{{prodata.projectStatus||'暂无'}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="项目简介" name="3" class="collapseText">
              <el-form-item label>
                <el-input
                  v-if="clicktype==='edit'"
                  v-model="prodata.projectDesc"
                  type="textarea"
                  :rows="2"
                ></el-input>
                <span v-else>{{prodata.projectDesc||'暂无'}}</span>
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="详细信息" name="4">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="建设单位：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectConstructionUnit"></el-input>
                    <span v-else>{{prodata.projectConstructionUnit||'暂无'}}</span>
                  </el-form-item>
                  <el-form-item label="监理单位：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectCheckUnit"></el-input>
                    <span v-else>{{prodata.projectCheckUnit||'暂无'}}</span>
                  </el-form-item>
                  <el-form-item label="设计单位：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectDesignUnit"></el-input>
                    <span v-else>{{prodata.projectDesignUnit||'暂无'}}</span>
                  </el-form-item>
                  <el-form-item label="施工单位：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectImplementUnit"></el-input>
                    <span v-else>{{prodata.projectImplementUnit||'暂无'}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="项目投资主题：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectInvestmentSubject"></el-input>
                    <span v-else>{{prodata.projectInvestmentSubject||'暂无'}}</span>
                  </el-form-item>
                  <el-form-item label="承建模式：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectConstructionModel"></el-input>
                    <span v-else>{{prodata.projectConstructionModel||'暂无'}}</span>
                  </el-form-item>
                  <el-form-item label="合同金额：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectContractPrice"></el-input>
                    <span v-else>{{prodata.projectContractPrice||'暂无'}}</span>
                  </el-form-item>
                  <el-form-item label="建筑面积：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectStructureArea"></el-input>
                    <span v-else>{{prodata.projectStructureArea||'暂无'}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="项目规模：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectScale"></el-input>
                    <span v-else>{{prodata.projectScale||'暂无'}}</span>
                  </el-form-item>
                  <el-form-item label="施工技术：">
                    <el-input
                      v-if="clicktype==='edit'"
                      v-model="prodata.projectImplementTechnology"
                    ></el-input>
                    <span v-else>{{prodata.projectImplementTechnology||'暂无'}}</span>
                  </el-form-item>
                  <el-form-item label="用地面积：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectUsedArea"></el-input>
                    <span v-else>{{prodata.projectUsedArea||'暂无'}}</span>
                  </el-form-item>
                  <el-form-item label="建筑高度：">
                    <el-input v-if="clicktype==='edit'" v-model="prodata.projectBuildingHeight"></el-input>
                    <span v-else>{{prodata.projectBuildingHeight||'暂无'}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="项目效果图" name="5">
              <el-row v-if="clicktype==='edit'">
                <el-col :span="5">
                  <!-- <el-image :src="'api/bjfiles/filesFilter/'+prodata.projectImg"></el-image> -->
                  <el-upload
                    class="imgList"
                    action="#"
                    list-type="picture-card"
                    :limit="20"
                    :file-list="explainImgList"
                    :on-remove="handleRemove"
                    :http-request="uploadImgList"
                  >
                    <i class="el-icon-plus" style="position: relative;bottom: 27px;"></i>
                  </el-upload>
                </el-col>
              </el-row>
              <el-row v-else>
                <!-- <el-col> -->
                <el-image
                  v-for="(item,j) in prodata.imgs"
                  :key="j"
                  :src="'api/bjfiles/filesFilter/'+item"
                  style="width: 300px"
                ></el-image>
                <!-- </el-col> -->
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </div>
    </el-main>
    <!-- </el-container> -->
  </div>
</template>
<script>
import { findById } from '../../api/proApi/project';
import { uploadImg, projectUpdate } from '../../api/proApi/index';
export default {
  name: '',
  data() {
    return {
      activeNames: ['1', '5'],
      prodata: {},
      projectId: localStorage.getItem('projectId'),
      clicktype: 'save',
      nowInd: null,
      src:
        'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      dialogImageUrl: '',
      disabled: false,
      explainImgList: []
    };
  },

  created() {
    this.projectId = localStorage.getItem('projectId');
    this.initPro();
  },
  methods: {
    initPro() {
      findById({
        id: this.projectId
      }).then(res => {
        if (res.code === 200) {
          this.explainImgList = [];
          this.prodata = res.data;
          if (this.prodata.imgs) {
            this.prodata.imgs.map((res, i) => {
              this.explainImgList.push({
                name: 'img' + i + '.jpg',
                uid: 123456,
                url: 'api/bjfiles/filesFilter/' + res
              });
            });
          } else {
            this.prodata.imgs = [];
          }
          this.$forceUpdate();
        }
      });
    },
    handleChange(val) {
      // console.log(val);
    },
    handleClick(val) {
      this.clicktype = val;
      if (val === 'save') {
        projectUpdate(this.prodata).then(res => {
          if (res.code === 200) {
            this.$message.success('更新成功');
            this.initPro();
          }
        });
      }
    },
    handleClickImg(index) {
      this.nowInd = index;
    },
    uploadImgList(item) {
      const blob = item.file;
      var formdata = new FormData();
      formdata.append('file', blob);
      formdata.append('companyId', this.prodata.companyId);
      uploadImg(formdata).then(res => {
        if (res.code === 200) {
          this.$forceUpdate();
          this.explainImgList.push({
            name: item.file.name,
            uid: item.file.uid,
            url: 'api/bjfiles/filesFilter/' + res.data.fileId
          });
          this.prodata.imgs.push(res.data.fileId);
          this.$message.success('上传成功');
        }
      });
    },

    handleRemove(file, fileList) {
      /* 移除图片 */
      this.explainImgList = fileList;
      this.prodata.imgs = [];
      fileList.map(res => {
        var index = res.url.substring(24, res.url.length);
        this.prodata.imgs.push(index);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.personSet {
  width: 100%;
  height: 100%;
  /deep/.el-form-item {
    margin-bottom: 0 !important;
  }
  .table {
    max-height: 80%;
    margin-top: px2rem(10);
    box-sizing: border-box;
    overflow: auto;
    background-color: $bgColor;
    /deep/ .el-form-item__content {
      line-height: 40px;
      position: relative;
      font-size: 14px;
      width: px2rem(240);
      float: left;
    }
    /deep/ .el-collapse-item__content {
      padding-bottom: 0;
    }
    /deep/ .el-form-item__label {
      width: px2rem(160);
    }
    .collapseText {
      /deep/ .el-form-item__content {
        line-height: 40px;
        position: relative;
        font-size: 14px;
        width: 100% !important;
      }
    }
  }
  .imgList .el-upload--picture-card {
    width: 82px;
    height: 82px;
  }

  .imgList .el-upload-list--picture-card .el-upload-list__item {
    width: 82px;
    height: 82px;
  }

  .imgList .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    width: 82px;
    height: 82px;
  }
  .setHeader {
    .lefts {
      .line {
        width: px2rem(3);
        height: px2rem(18);
        margin-right: px2rem(10);
        background: $font;
      }
      .titles {
        font-size: px2rem(18);
      }
    }
    .rights {
      .el-input {
        width: px2rem(200);
      }
      /deep/ .el-input__inner {
        width: px2rem(200);
        height: 40px;
        line-height: 40px;
        font-size: px2rem(12);
        padding: 0 px2rem(30);
        color: $inputplace !important;
      }
      .el-icon-search::before {
        position: absolute;
        top: px2rem(18);
        left: px2rem(5);
      }
      .dangers {
        margin-right: px2rem(20);
      }
      .dangers:hover {
        border-color: $btnhover;
        background: $btnhover;
      }

      .el-button {
        padding: px2rem(10) px2rem(15);
      }
      /deep/ .el-select {
        width: px2rem(120);
        margin-left: px2rem(20);
        /deep/ .el-input__inner {
          width: 100%;
          padding-right: px2rem(20);
        }
      }
    }
  }
}
</style>
