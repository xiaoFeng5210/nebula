<template>
  <!-- 简约模式 -->
  <div class="viewport" v-if="listType === false">
    <div class="view_box bg-white">
      <div class="d-flex jc-between ai-center view_top">
        <p class="text-dark view_title">视口管理</p>
        <div class="closeBtn" @click="closeViewport">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="d-flex jc-between ai-center view_center">
        <div class="new_create bg-primary text-white" @click="setBtn">
          <i class="el-icon-plus iconBtn"></i>
          新建视口
        </div>
        <div class="new_create bg-primary text-white" @click="listView(1)">
          <i class="el-icon-s-unfold iconBtn"></i>
          列表视图
        </div>
      </div>
      <div class="serch-input">
        <el-input placeholder="请输入视口名称" v-model="searchName" @keyup.enter.native="searchViewport">
          <i slot="prefix" class="el-input__icon el-icon-search" @click="searchViewport"></i>
          <i
            slot="suffix"
            class="el-icon-circle-close"
            @click="clearViewport"
            v-if="searchName.length>0"
          ></i>
        </el-input>
      </div>
      <div class="view_list" ref="viewList" @scroll="listScroll">
        <div class="view_detail" v-for="(item, index) in Newviews" :key="index">
          <div class="view_name" @click="backPosition(item)">{{ item.name }}</div>
          <div class="view_img" @click="backPosition(item)">
            <img
              :src="basesrc+item.imgUrl"
              @mouseenter="enter(index)"
              @mouseleave="leave"
              @click="enter(index)"
              alt
            />
          </div>
          <div v-show="showNote&&index === current" class="note_show">
            <div class="closeIcon">
              <i class="el-icon-close" @click="leave"></i>
            </div>
            <div class="note">{{item.remark}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新建视口弹窗 -->
    <el-dialog title="新建视口" :visible.sync="setDialog" :close-on-click-modal="false"
      @close="reset('ruleForm')">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="视口名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" maxlength="30" show-word-limit placeholder="请输入视口名称"></el-input>
        </el-form-item>
        <el-form-item label="标识样式" :label-width="formLabelWidth" prop="imgUrl">
          <div style="width:100%;height:100%">
            <img :src="addimgUrl" style="width:100%;height:100%" />
          </div>
        </el-form-item>
        <el-form-item label="视口备注" :label-width="formLabelWidth" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            maxlength="50"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入视口备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="addSure('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  <!-- 列表模式 -->
  <div v-else class="simple">
    <el-container>
      <el-header class="bg-white">
        <el-row>
          <el-col :span="4" class="self-title">
            <i class="bg-primary"></i>
            视口管理
          </el-col>
          <el-col :span="14"></el-col>
          <el-col :span="1">
            <el-button
              size="mini"
              class="deleteBtn"
              @click="deleteBtn"
              v-if="this.ids.length !== 0"
            >删除</el-button>
          </el-col>
          <el-col :span="3" class="text-center">
            <el-input
              placeholder="请输入视口名称"
              v-model="searchName"
              @keyup.enter.native="searchViewport"
            >
              <i slot="prefix" class="el-input__icon el-icon-search" @click="searchViewport"></i>
              <i
                slot="suffix"
                class="el-icon-circle-close"
                @click="clearViewport"
                v-if="searchName.length>0"
              ></i>
            </el-input>
          </el-col>
          <el-col :span="2" class="text-center">
            <el-button type="primary" size="mini" @click="listView(2)">切换至简约模式</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div class="view_box d-flex jc-start">
          <div class="view_subBox text-dark" v-for="(item, index) in Newviews" :key="index">
            <div class="view_detail">
              <div class="view_title d-flex jc-between">
                <div class="view_name">{{ item.name }}</div>
                <div class="closeBtn text-center">
                  <el-checkbox v-model="item.isCheck" @change="changeSelect(item)"></el-checkbox>
                </div>
              </div>
              <div class="view_pic" @click="backPosition(item)">
                <img :src="basesrc+item.imgUrl" alt />
              </div>
              <div class="view_remark">{{ item.remark }}</div>
            </div>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="currentChange"
          :page-size="listParams.size"
          :current-page="listParams.page"
        ></el-pagination>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { upload } from '@/api/user';
import { addViewport, getViewport, deleteViewport } from '@/api/viewport';
import base64IMg from '@/utils/aes'; // 引入js将base64图片转文件形式
export default {
  name: 'viewport',
  data() {
    return {
      checked: false,
      basesrc: 'api/bjfiles/filesFilter/',
      companyId: localStorage.getItem('companyId'),
      showNote: false,
      showDel: false,
      current: 0,
      ids: [], // 批量删除ids
      addimgUrl: '',
      REge: [],
      total: 0,
      listParams: {
        // 获取列表参数
        size: 12,
        page: 1,
        name: '',
        projectId: localStorage.getItem('projectId')
      },
      searchName: '', // 按视口名称查找
      listType: false, // 切换列表模式和简约模式
      setDialog: false, // 新建视口弹窗的显示隐藏
      formLabelWidth: '120px',
      form: {
        name: '', // 新建名称
        imgUrl: '',
        remark: '', // 备注
        xyz: '',
        orientation: '',
        projectId: localStorage.getItem('projectId'),
        companyId: localStorage.getItem('companyId')
      },
      ruleForm: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '请输入视口名称', trigger: 'blur' }]
      },
      Newviews: []
    };
  },
  mounted() {
    this.getList();
  },
  computed: {},
  methods: {
    // 关闭弹框后清空表单内容
    closeDialog(formName) {
      this.setDialog = false;
      this.$refs[formName].resetFields();
    },
    reset(formName) {
      this.$refs[formName].resetFields();
    },
    // 新建视口弹窗
    setBtn() {
      this.setDialog = true;
      this.addimgUrl = REgetScreenPrintImage();
      const base64Data = this.addimgUrl;
      // 调用
      const blob = base64IMg.base64ToBlob(base64Data);
      var formdata = new FormData();
      formdata.append('companyId', this.companyId);
      formdata.append('file', blob);
      // 获取视口图片的地址
      upload(formdata).then(res => {
        if (res.code === 200) {
          this.form.imgUrl = res.data.fileId;
        }
      });
      this.REge = REgetCamLocation(); // 获取相机方位
      this.form.xyz = this.REge.m_vCamPos.join(',');
      this.form.orientation = this.REge.m_qCamRotate.join(',');
    },
    // 全景切换至对应视口位置
    backPosition(item) {
      RElocateCamTo(item.xyz, item.orientation, 0.0);
      this.listType = false;
      this.$emit('show-model');
    },
    // 增加视口
    addSure(formName) {
      if (this.form.name.length <= 0) {
        this.$message.error('请输入视口名称');
        this.setDialog = true;
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addViewport(this.form).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                });
                this.setDialog = false;
                this.$refs[formName].resetFields();
                this.getList();
              }
            });
          } else {
            return false;
          }
        });
      }
    },
    // 获取视口列表
    getList() {
      getViewport(this.listParams).then(res => {
        if (res.code === 200) {
          var views = res.data.list;
          this.total = res.data.total;
          if (!views) {
            return;
          } else {
            for (var i = 0; i < views.length; i++) {
              views[i].isCheck = false;
              // 朝向
              var newOrientation = [];
              if (!views[i].orientation) {
                return;
              }
              newOrientation = views[i].orientation.split(',');
              views[i].orientation = newOrientation.map(Number);
              // 位置坐标
              var newXyz = [];
              if (!views[i].xyz) {
                return;
              }
              newXyz = views[i].xyz.split(',');
              views[i].xyz = newXyz.map(Number);
            }
            this.Newviews = views;
          }
        }
      });
    },
    // 加载更多
    listScroll() {
      const sheis = this.$refs.viewList.scrollHeight;
      const heis = this.$refs.viewList.clientHeight;
      const stops = this.$refs.viewList.scrollTop;
      if (stops + heis >= sheis) {
        this.listParams.page++;
        this.getList();
      }
    },
    // 关闭视口管理
    closeViewport() {
      this.$emit('close-tagbox');
    },
    // 控制简约模式下备注的显示隐藏
    enter(index) {
      this.showNote = true;
      this.current = index;
    },
    leave() {
      this.showNote = false;
      this.current = null;
    },
    // 切换列表模式
    listView(num) {
      if (num === 1) {
        this.listType = true;
      } else if (num === 2) {
        this.listType = false;
      }
      this.$emit('showList', num);
    },
    // 选中删除
    changeSelect(item) {
      if (item.isCheck === true) {
        this.ids.push(item.id);
      } else {
        this.ids.pop(item.id);
      }
    },
    // 删除视口
    deleteBtn() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteViewport({ ids: this.ids }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList();
              this.ids = [];
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 根据名称搜索
    searchViewport() {
      if (!this.searchName) {
        this.$message({
          message: '输入框不能为空',
          type: 'warning'
        });
      } else {
        this.listParams.name = this.searchName;
        this.getList();
        this.searchName = '';
      }
    },
    // 清空输入框重新页面
    clearViewport() {
      this.searchName = '';
      this.listParams.name = this.searchName;
      this.getList();
    },
    // 分页导航
    currentChange(val) {
      this.listParams.page = val;
      this.getList();
    }
    //
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
.viewport {
  .panorama {
    width: 100%;
    height: 100%;
    .fiexd-top {
      width: 100%;
      position: fixed;
      z-index: 1000;
      .top-center {
        position: absolute;
        left: 35%;
        top: 10%;
        transform: translate(-35%, -10%);
        background: rgba($color: $span, $alpha: 0.5);
        padding: px2rem(10);
        font-size: px2rem(12);
        img {
          width: px2rem(20);
        }
      }
    }
  }
  .view_box {
    position: absolute;
    right: 0;
    width: px2rem(332);
    height: 100%;
    z-index: 1000;
    .view_top {
      margin: 0 px2rem(3);
      padding: 0 px2rem(7);
      font-size: px2rem(14);
      height: px2rem(44);
      border-bottom: 1px solid $borBottom;
      .view_title {
        font-weight: bold;
      }
      .closeBtn {
        cursor: pointer;
        z-index: 10000;
      }
    }
    .view_center {
      height: px2rem(59);
      margin: 0 px2rem(3);
      padding: 0 px2rem(7);
      font-size: px2rem(13);
      border-bottom: 1px solid $borBottom;
      .new_create {
        width: px2rem(85);
        height: px2rem(34);
        line-height: px2rem(34);
        text-align: center;
        border-radius: px2rem(3);
        cursor: pointer;
      }
    }
    .serch-input {
      /deep/ .el-input {
        width: 90%;
        margin: px2rem(10) 5%;
        /deep/ .el-input__suffix {
          position: absolute;
          height: 100%;
          top: px2rem(14);
          right: px2rem(10);
        }
        /deep/ .el-input__prefix:hover {
          cursor: pointer;
        }
      }
    }
    .view_list {
      height: px2rem(960);
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0 px2rem(10);
      .view_detail {
        margin-bottom: px2rem(17);
        .view_name {
          margin: px2rem(10) 0;
          font-size: px2rem(13);
          cursor: pointer;
        }
        .view_img {
          width: px2rem(304);
          height: px2rem(160);
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .note_show {
          position: absolute;
          width: px2rem(400);
          height: px2rem(77);
          border-radius: px2rem(5);
          padding: px2rem(8);
          background: $bgColor;
          top: 50%;
          right: 100%;
          .closeIcon {
            height: px2rem(20);
            text-align: right;
          }
          .note {
            font-size: px2rem(14);
            line-height: px2rem(26);
          }
        }
      }
    }
  }
}
.simple {
  .el-header {
    height: px2rem(60) !important;
    line-height: px2rem(60);
    margin-left: px2rem(10);
    padding: 0 px2rem(10);
    box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.1);
    .el-col {
      padding: px2rem(1);
      i {
        width: px2rem(4);
        height: px2rem(18);
        margin: px2rem(-2) px2rem(10);
        display: inline-block;
      }
      .self-title {
        color: $selfTitle;
        font-size: px2rem(18);
      }
      .timeSpace {
        display: inline-block;
        margin: 0 px2rem(10);
        color: $selfTitle;
      }
      .deleteBtn {
        color: $absColor;
      }
    }
    /deep/ .el-input__inner {
      height: px2rem(34);
      line-height: px2rem(34);
      font-size: px2rem(13);
    }
    /deep/ .el-input__prefix {
      position: absolute;
      height: 100%;
      top: px2rem(8);
      left: 0;
    }
    /deep/ .el-input__prefix:hover {
      cursor: pointer;
    }
  }
  .el-main {
    height: 86vh;
    position: relative;
    background: #fff;
    margin: px2rem(10);
    padding: 0 px2rem(10);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    .view_box {
      margin: px2rem(20) px2rem(54);
      flex-wrap: wrap;
      align-content: flex-start;
      .view_subBox {
        width: px2rem(337);
        height: p2rem(254);
        margin: px2rem(20) px2rem(56);
        border-radius: px2rem(3);
        background: $view_bg;
        font-size: px2rem(13);
        .view_detail {
          margin-left: px2rem(16);
          .view_title {
            font-size: px2rem(13);
            .view_name {
              margin: px2rem(7) 0;
            }
            .closeBtn {
              width: px2rem(24);
              height: px2rem(22);
              line-height: px2rem(22);
              color: $bluebor;
              background: $close_bg;
              cursor: pointer;
            }
          }
          .view_pic {
            width: px2rem(304);
            height: px2rem(161);
            cursor: pointer;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .view_remark {
            font-size: px2rem(13);
            line-height: px2rem(26);
            height: px2rem(43);
            margin: px2rem(10) px2rem(3);
          }
        }
      }
    }
    .el-pagination {
      text-align: center;
      position: absolute;
      left: 50%;
      bottom: px2rem(20);
      transform: translateX(-50%);
    }
  }
}
</style>
