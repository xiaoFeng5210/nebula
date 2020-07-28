<template>
  <div class="rolemanage">
    <div class="setHeader bg-white d-flex jc-between ai-center">
      <div class="lefts d-flex jc-between ai-center">
        <div class="line"></div>
        <div class="titles">角色权限</div>
      </div>
      <div class="rights">
        <el-button type="primary">添加角色</el-button>
      </div>
    </div>
    <el-collapse class="bg-white" v-model="activeName" accordion @change="handleChange">
      <el-collapse-item class="bg-white"
        v-for="(item, index) in dynamicItem"
        :key="index"
        :title="item.roleName"
        :name="(item.id)"
      >
        <div class="handle">
          <!-- <el-button type="primary" size="mini" plain @click="redact">编辑</el-button> -->
          <!-- <el-button type="danger" size="mini" plain @click="deleteItem">清除</el-button> -->
        </div>
        <div v-for="(items, indexs) in rolesList" :key="indexs">
          <div class="titles">{{items.resourcesName}}</div>
          <div :vues="vues" class="itemson d-flex jc-start ai-center">
            <el-switch
              v-model="items.useLess"
              :inactive-text="items.resourcesName"
              active-color="#13ce66"
              inactive-color="#ccc"
              @change="switchs($event,indexs)"
            ></el-switch>
            <el-checkbox-group class="d-flex jc-start ai-center" v-model="checkList">
              <div class="checs" v-for="(ite, indexj) in items.nodes" :key="indexj">
                <el-checkbox :label="ite.id">{{ite.resourcesName}}</el-checkbox>
                <div v-if="items.resourcesType==2" class="sets el-icon-s-tools">23123123</div>
              </div>
            </el-checkbox-group>
            <!-- <div v-if="items.resourcesType==0" class="sets el-icon-s-tools">23123123</div> -->
          </div>
        </div>
        <div class="save text-center">
          <el-button type="primary" round @click="onSubmit">保存</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-form class="text-left" ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
        <el-form-item label="显示等级">
          <el-select v-model="form.showType" placeholder="请选择活动区域">
            <el-option label="星云平台" value="A"></el-option>
            <el-option label="星云公司" value="B"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saves">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllRoles,
  getResourceList,
  getDefaultPermis,
  addPostilList,
  saveSysRole
} from '@/api/privilege';
export default {
  name: 'roleManage',
  data() {
    return {
      activeName: '',
      checkList: [],
      dynamicItem: [],
      rolesList: [],
      vues: 0,
      dialogVisible: false,
      form: {
        companyId: localStorage.getItem('companyId'),
        roleName: '',
        roleDesc: '',
        showType: '',
        statue: 0
      }
    };
  },
  created() {
    this.getScope();
  },
  mounted() {},
  methods: {
    getScope() {
      const id = localStorage.getItem('companyId');
      getAllRoles(id).then(res => {
        if (res.code === 200) {
          this.dynamicItem = res.data;
        }
      });
    },
    getList() {
      this.vues++;
      if (this.activeName) {
        getResourceList().then(res => {
          if (res.code === 200) {
            this.rolesList = res.data;
          }
        });
        getDefaultPermis(this.activeName).then(res => {
          if (res.code === 200) {
            this.checkList = res.data;
            this.rolesList.forEach(j => {
              if (this.checkList.includes(j.id)) {
                j.useLess = true;
              }
            });
          }
        });
      }
    },
    onSubmit() {
      const datas = {
        roleId: this.activeName,
        resourcesIds: this.checkList
      };
      addPostilList(datas).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getList();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleChange() {
      this.getList();
    },
    addItem() {
      this.dialogVisible = true;
      this.form.roleName = '';
      this.form.roleDesc = '';
      this.form.showType = '';
    },
    saves() {
      saveSysRole(this.form).then(res => {
        if (res.code === 200) {
          this.$message.success('添加成功');
          this.getScope();
          this.dialogVisible = false;
        }
      });
    },
    switchs($event, num) {
      if ($event === true) {
        this.checkList.push(this.rolesList[num].id);
      } else {
        const ids = this.checkList.indexOf(this.rolesList[num].id);
        this.checkList.splice(ids, 1);
      }
    },
    redact(item, index) {
      console.log(item, index);
    },
    deleteItem(item, index) {
      this.dynamicItem.splice(index, 1);
    }
  }
};
</script>
<style lang="scss" scoped>
.rolemanage {
  width: 100%;
  overflow: auto;
  position: relative;
  .setHeader {
    padding: px2rem(10) px2rem(20);
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
  .el-collapse{
    height: px2rem(960);
    margin-top: px2rem(10);
  }
  /deep/ .el-collapse-item {
    padding: 0 px2rem(10);
    .handle {
      position: absolute;
      right: px2rem(50);
      margin-top: px2rem(-25);
    }
  }
  /deep/ .el-collapse-item__content {
    height: px2rem(820);
    overflow: auto;
  }
  .itemson {
    height: px2rem(60);
    line-height: px2rem(60);
    background: $itemson;
    padding: px2rem(10);
    border-bottom: px2rem(1) solid $bgTitles;
    .checs {
      width: px2rem(140);
      .sets {
        width: px2rem(20);
        height: px2rem(20);
        position: absolute;
        margin-top: px2rem(20);
      }
    }
    /deep/ .el-switch__label.is-active {
      color: #333;
    }
    /deep/ .el-switch {
      text-align: center;
      width: px2rem(200);
    }
    /deep/ .el-switch__label {
      margin-left: px2rem(30);
    }
    /deep/ .el-checkbox-group {
      width: 80%;
      margin-left: px2rem(30);
    }
  }
  .save {
    margin: px2rem(20) 0;
    .el-button {
      width: px2rem(240);
    }
  }
}
</style>
