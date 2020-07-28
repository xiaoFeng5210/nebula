<template>
  <!-- 发公告弹窗 -->
  <el-dialog title="新建公告" :visible.sync="noticeDialog" width="30%" :modal="false" :close-on-click-modal="false" @close="reset('formData')">
    <!-- 选择人员弹窗 -->
    <el-dialog title="选择人员" :visible.sync="choseStaff" width="30%" append-to-body>
      <div class="d-flex jc-between choseDialog">
        <div class="choseBox">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="按组织选择" name="first">
              <div>
                <el-input placeholder="请输入组织名称"></el-input>
                <el-tree
                  :data="organizeData"
                  show-checkbox
                  node-key="id"
                  :default-expanded-keys="[2, 3]"
                  :default-checked-keys="[5]"
                  :props="defaultProps"
                ></el-tree>
              </div>
            </el-tab-pane>
            <el-tab-pane label="按角色选择" name="second">
              <div>
                <el-input placeholder="请输入角色名称"></el-input>
                <el-tree
                  :data="roleData"
                  show-checkbox
                  node-key="id"
                  :default-expanded-keys="[2, 3]"
                  :default-checked-keys="[5]"
                  :props="defaultProps"
                ></el-tree>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="staffBox">
          <p class="chosedNum">已选人员（0）</p>
          <div class="chosedList"></div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="choseStaff = false">取 消</el-button>
        <el-button type="primary" @click="choseStaff = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-form :model="formData" :rules="noticerules" ref="formData">
      <el-form-item label="公告标题" prop="title" :label-width="formLabelWidth">
        <el-input v-model="formData.title" placeholder="请输入公告标题"></el-input>
      </el-form-item>
      <el-form-item label="公告内容" :label-width="formLabelWidth" prop="content">
        <el-input
          type="textarea"
          v-model="formData.content"
          placeholder="请输入公告内容"
          maxlength="200"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="公告人员" :label-width="formLabelWidth" prop="scope">
        <div class="range d-flex">
          <div class="staffBox"></div>
          <div class="choseBtn" @click="getchoseStaff">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="附件" :label-width="formLabelWidth" prop="attachmentUrl">
        <el-upload
          :action="uploadUrl"
          :headers="uploadHeader"
          :data="uploadParams"
          :on-error="onError"
          :on-success="onsuccess"
          :show-file-list="false"
        >
          <el-button size="small">点击上传</el-button>
        </el-upload>
        <div class="attach_box">
          <div class="imgBox d-flex" v-for="(item, index) in files" :key="index">
            <img v-if="item.fileSuffix === 'doc'" src="../../assets/fileType/doc.png" alt />
            <img v-else-if="item.fileSuffix === 'psd'" src="../../assets/fileType/psd.png" alt />
            <img v-else-if="item.fileSuffix === 'docx'" src="../../assets/fileType/docx.png" alt />
            <img v-else-if="item.fileSuffix === '3ds'" src="../../assets/fileType/3ds.png" alt />
            <img v-else-if="item.fileSuffix === 'dwg'" src="../../assets/fileType/dwg.png" alt />
            <img v-else-if="item.fileSuffix === 'zip'" src="../../assets/fileType/zip.png" alt />
            <img v-else-if="item.fileSuffix === 'xlsx'" src="../../assets/fileType/xlsx.png" alt />
            <img v-else-if="item.fileSuffix === 'pdf'" src="../../assets/fileType/pdf.png" alt />
            <img v-else-if="item.fileSuffix === 'txt'" src="../../assets/fileType/txt.png" alt />
            <img v-else-if="item.fileSuffix === 'ppt'" src="../../assets/fileType/ppt.png" alt />
            <img v-else-if="item.fileSuffix === 'png'" src="../../assets/fileType/png.png" alt />
            <img v-else-if="item.fileSuffix === 'jpg'" src="../../assets/fileType/jpg.png" alt />
            <img v-else-if="item.fileSuffix === 'xls'" src="../../assets/fileType/xls.png" alt />
            <img v-else-if="item.fileSuffix === 'word'" src="../../assets/fileType/word.png" alt />
            <img v-else-if="item.fileSuffix === 'svg'" src="../../assets/fileType/svg.png" alt />
            <img v-else-if="item.fileSuffix === 'ps'" src="../../assets/fileType/ps.png" alt />
            <div class="fileBox">
              <div class="fileName">{{item.fileName}}</div>
              <div class="fileName">{{item.fileSize}}</div>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelNotice('formData')">取 消</el-button>
      <el-button type="primary" @click="addNotice('formData')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth';
import { addAnnounce, getRole, getRoleByStaff} from '@/api/workTable';
export default {
  name: 'announce',
  data() {
    return {
      roleData: [],
      staffData:[],
      projectId: localStorage.getItem('projectId'),
      deptId: '',
      companyId: localStorage.getItem('companyId'),
      uploadParams: {
        companyId: localStorage.getItem('companyId')
      },
      uploadHeader: { Authorization: 'Bearer ' + getToken('token') },
      uploadUrl: 'api/bjfiles/files/upload',
      files: [],
      activeName: '',
      noticeDialog: false,
      choseStaff: false, // 选择人员弹窗
      organizeData: [],
      roleData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      formData: {
        companyId: localStorage.getItem('companyId'),
        projectId: localStorage.getItem('projectId'),
        title:'',
        content:'',
        attachmentUrl:'',
        scope:''
      },
      noticerules: {
        title: [{ required: true, message: '请填写公告标题', trigger: 'blur' }]
      },
      formLabelWidth: '120px'
    };
  },
  methods: {
    // 取消发公告
    cancelNotice(formName) {
      this.noticeDialog = false;
      this.$refs[formName].resetFields();
    },
    reset(formName) {
      this.$refs[formName].resetFields();
    },
    announceVisible() {
      this.noticeDialog = true;
    },
    // 上传成功
    onsuccess(res) {
      if(res.code === 200) {
        this.files.push(res.data);
      }
    },
    // 上传失败
    onError(err) {
      this.$message.error(err.message);
    },
    // 发公告
    addNotice(formName){
      if(this.formData.title.length <= 0) {
        this.$message.error('请输入公告标题');
        this.noticeDialog = true;
      } else {
        this.$refs[formName].validate(valid => {
          console.log('0000');
          if (valid) {
            addAnnounce(this.form).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                });
                this.noticeDialog = false;
                this.$refs[formName].resetFields();
              }
            });
          } else {
            return false;
          }
        });
      }
    },
    getchoseStaff() {
      this.choseStaff = true;
      // 按角色选
      // 按组织
    },
    handleClick() {}
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.el-dialog {
  .el-form {
    .el-form-item {
      .range {
        min-height: px2rem(35);
        .choseBtn {
          border: 1px dashed $font;
          border-radius: 50%;
          width: px2rem(30);
          height: px2rem(30);
          cursor: pointer;
          position: relative;
          .avatar-uploader-icon {
            width: px2rem(30);
            height: px2rem(30);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: $font;
            font-size: px2rem(20);
            line-height: px2rem(30);
            text-align: center;
          }
        }
      }
      .attach_box {
        overflow-y: auto;
        margin-top: px2rem(12);
        height: px2rem(182);
        border: 1px solid rgba(193, 202, 211, 1);
        border-radius: px2rem(3);
        .imgBox {
          height: px2rem(60);
          padding: px2rem(10);
          .fileBox {
            font-size: px2rem(13);
            margin-left: px2rem(18);
            flex: 1;
            height: px2rem(36);
            line-height: px2rem(20);
            .fileName {
              height: px2rem(20);
              padding-bottom: px2rem(5);
            }
          }
        }
      }
    }
  }
  .choseDialog {
    .choseBox {
      width: px2rem(277);
      height: px2rem(360);
    }
    .staffBox {
      .chosedList {
        width: px2rem(277);
        height: px2rem(360);
        border: 1px solid rgba(193, 202, 211, 1);
        border-radius: px2rem(2);
      }
    }
  }
}
</style>
