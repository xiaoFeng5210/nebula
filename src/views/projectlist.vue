    <template>
  <div class="projectList">
    <el-container>
      <el-header>
        <projectHeader
          :title="titles[active]"
          @islist="checkislist"
          @showdialog="addDialog"
          :isshowimg="isshowimg"
        ></projectHeader>
      </el-header>
      <el-main>
        <imgList v-if="isshowimg" @modifydialog="modifyItem" />
        <tabList v-else @modifydialog="modifyItem" />
        <!-- 创建项目的弹窗 -->
        <el-dialog
          :title="dialogTit"
          :visible.sync="dialogFormVisible"
          v-if="dialogFormVisible"
          :close-on-click-modal="false"
          width="40%"
          class="demo-ruleForm"
        >
          <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item prop="projectTag" label="项目类型">
              <el-select v-model="form.projectTag" placeholder="请选择活动区域">
                <el-option label="单项目" value="单项目"></el-option>
                <el-option label="集群项目" value="集群项目"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.projectTag === '集群项目'" prop="ids">
              <el-select v-model="form.ids" multiple placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="projectName" label="项目名称">
              <el-input v-model="form.projectName" autocomplete="off" @change="changeInput"></el-input>
              <el-col v-if="hasname" :span="12" :offset="8" style="color: red;">* 输入的名称不能重复</el-col>
            </el-form-item>
            <el-form-item label="项目介绍" prop="info">
              <el-input v-model="form.projectDesc" type="textarea" :rows="2" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="封面图片">
              <!-- :before-upload="handleChangeImg" -->
              <el-upload
                action="#"
                :show-file-list="false"
                :auto-upload="false"
                :on-success="uploadSuccessHandle"
                :on-change="handleChangeImg"
                accept=".jpg, .jpeg, .png"
              >
                <img
                  v-if="form.projectImg"
                  ref="projectImg"
                  :src="'api/bjfiles/filesFilter/'+ form.projectImg"
                  class="avatar"
                  style="width: 300px"
                />
                <i v-else class="el-icon-plus" />
              </el-upload>
            </el-form-item>
            <el-form-item v-if="dialogType === 'modify'" style="text-align:center">
              <el-button type="danger" @click="deleteItem">删除项目</el-button>
            </el-form-item>
            <el-form-item style="text-align:right">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submit('form')">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import projectHeader from '@/components/comModule/projectHeader';
import tabList from '@/components/projectList/tabList';
import imgList from '@/components/projectList/imgList';
import {
  getSingleListByCompanyId,
  findByProjectName,
  projectSave,
  projectUpdate,
  uploadImg,
  delById
} from '../api/proApi/index';
// import base64IMg from '@/utils/aes';
export default {
  name: 'projectList',
  components: {
    projectHeader,
    tabList,
    imgList
  },
  data() {
    return {
      titles: [{ tab: '项目集', id: 0 }],
      hasname: false,
      active: 0,
      isshowimg: 1, // 1为图片列表， 0为tab表格列表
      companyId: localStorage.getItem('companyId'),
      listParams: {
        companyId: localStorage.getItem('companyId'),
        sort: '23',
        content: ''
      },
      isshowDialog: false,
      dialogTit: '新建项目',
      dialogFormVisible: false,
      imageUrl: '',
      checkList: [],
      options: [],
      form: {
        companyId: localStorage.getItem('companyId'),
        projectName: '',
        projectTag: '',
        createTime: '',
        projectDesc: '',
        imgsrc: '',
        projectImg: '',
        type: 1,
        ids: []
      },
      rules: {
        projectName: [
          { required: true, message: '项目名称不能为空', trigger: 'change' },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur'
          }
        ],
        projectTag: [
          { required: true, message: '请选择项目类型', trigger: 'change' }
        ],
        ids: [{ required: true, message: '请选择项目类型', trigger: 'blur' }],
        info: [
          { required: false, message: '请选择项目类型', trigger: 'change' },
          {
            min: 0,
            max: 1000,
            message: '最多可输入1000个字',
            trigger: 'change'
          }
        ]
      },
      nameParam: {
        companyId: localStorage.getItem('companyId'),
        projectName: ''
      },
      params: {
        companyId: localStorage.getItem('companyId')
      },
      dialogType: '',
      dialogImageUrl: '',
      disabled: false
    };
  },
  mounted() {
    this.getdialogSingleitem();
  },
  methods: {
    uploadSuccessHandle(e) {
      this.$forceUpdate();
      this.form.projectImg = e.url;
    },
    checkislist(val) {
      this.isshowimg = val;
    },
    addDialog(val) {
      // 新建项目
      if (val === 'add') {
        this.dialogFormVisible = true;
        this.dialogType = val;
        this.form = {};
        this.form.companyId = this.listParams.companyId;
        this.form.type = 1;
      }
    },
    modifyItem(val) {
      if (val && val.type === 'modify') {
        this.dialogFormVisible = true;
        this.dialogType = val.type;
        this.form.type = 1;
        this.form = JSON.parse(val.item);
      }
    },
    changeInput() {
      this.nameParam.companyId = this.listParams.companyId;
      this.nameParam.projectName = this.form.projectName;
      this.Inputsearch();
    },
    getdialogSingleitem() {
      // console.log(this.params);
      getSingleListByCompanyId(this.params).then((res) => {
        if (res.code === 200) {
          if (res.data && res.data.list) {
            const result = res.data.list;
            result.map((x) => {
              this.options.push({
                value: x.id,
                label: x.projectName
              });
            });
          }
        }
      });
    },
    Inputsearch() {
      findByProjectName(this.nameParam).then((res) => {
        if (res.code === 200) {
          if (res.data && res.data !== '') {
            if (this.dialogType === 'modify') {
              // 编辑重名
              if (this.form.companyId !== res.data.companyId) {
                this.hasname = true;
              }
            } else if (this.dialogType === 'add') {
              // 新增重名
              this.hasname = true;
            }
          } else {
            this.hasname = false;
          }
        }
      });
    },
    submit(form) {
      if (!this.hasname) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.dialogType === 'add') {
              this.postprojectSave();
            } else if (this.dialogType === 'modify') {
              this.postprojectUpdate();
            }
          } else {
            return false;
          }
        });
      }
    },
    postprojectSave() {
      projectSave(this.form).then((res) => {
        if (res.code === 200) {
          this.dialogFormVisible = false;
          this.$message.success('创建成功');
          this.$store.commit('SET_LOAD');
        }
      });
    },
    postprojectUpdate() {
      projectUpdate(this.form).then((res) => {
        if (res.code === 200) {
          this.dialogFormVisible = false;
          this.$message.success('修改成功');
          this.$store.commit('SET_LOAD');
        }
      });
    },
    deleteItem() {
      this.$confirm('此操作将删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delById({
            id: this.form.id
          }).then((res) => {
            if (res.code === 200) {
              this.dialogFormVisible = false;
              this.$message.success('删除成功');
              this.$store.commit('SET_LOAD');
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
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
    handleChangeImg(file) {
      const blob = file.raw;
      var formdata = new FormData();
      formdata.append('file', blob);
      formdata.append('companyId', this.form.companyId);
      uploadImg(formdata).then((res) => {
        if (res.code === 200) {
          this.$forceUpdate();
          this.form.projectImg = res.data.fileId;
          this.$nextTick(() => {
            this.$refs.projectImg.src =
              'api/bjfiles/filesFilter/' + res.data.fileId;
          });
        }
      });
    }
  },
  watch: {
    dialogType: function (val) {
      if (val === 'add') {
        this.dialogTit = '新建项目';
      } else if (val === 'modify') {
        this.dialogTit = '修改项目';
      }
    }
  }
};
</script>
    <style lang="scss" scoped>
.projectList {
  .el-container {
    .el-header {
      height: px2rem(60) !important;
      line-height: px2rem(60);
      margin-left: px2rem(10);
      margin-bottom: px2rem(20);
      padding: 0;
    }
    .el-main {
      padding: 0;
      box-sizing: border-box;
      .formlabel {
        text-align: center;
      }
    }
  }
}
</style>
