<template>
  <div class="newpostil">
    <el-dialog
      title="新建批注"
      :visible.sync="dialogFormVisible"
      :before-close="callOff"
      width="40%"
      class="demo-ruleForm"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item prop="projectTag" label="批注名称">
          <el-input v-model="form.postilName"></el-input>
        </el-form-item>
        <el-form-item label="批注标签">
          <el-select v-model="form.tag" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="partInUser" label="参与人员">
          <el-select v-model="valus" multiple @change="handleChange" placeholder="请选择">
            <el-option
              v-for="items in users"
              :key="items.id"
              :label="items.accountName"
              :value="items.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="content" label="批注内容">
          <el-input v-model="form.content" type="textarea" :rows="2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="批注视口">
          <div class="postill">
            <div class="imgBox" v-for="(items,index) in viewport" :key="index">
              <img class="enginlist" :src="'api/bjfiles/filesFilter/'+items" />
            </div>
            <div class="plus el-icon-plus" @click="callOff(1)" v-if="viewport.length<=5"></div>
          </div>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="callOff">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { addPostilList } from '@/api/postil';
import { AuditUser } from '@/api/proApi/project';
export default {
  props: {
    obj: String,
    imgList: Array,
    coordinatesL: Object,
    buildId: Number
  },
  data() {
    return {
      dialogFormVisible: true,
      viewport: this.$props.imgList,
      options: [
        {
          value: '2',
          label: '我参与的'
        },
        {
          value: '1',
          label: '我创建的'
        }
      ],
      valus: [],
      form: {
        postilName: '',
        tag: '',
        buildId: this.$props.buildId,
        companyId: localStorage.getItem('companyId'),
        partInUser: [],
        content: '',
        viewport: JSON.stringify({
          viewId: this.$props.coordinatesL,
          viewIMg: this.$props.imgList
        }),
        projectId: localStorage.getItem('projectId')
      },
      rules: {},
      users: [],
      hasname: false
    };
  },
  mounted() {
    const _this = this;
    _this.getUser();
    if (_this.$props.obj !== '') {
      _this.form = JSON.parse(this.$props.obj);
      _this.form.partInUser.forEach(a => {
        _this.valus.push(a.id);
      });
    }
  },
  methods: {
    getUser() {
      AuditUser({
        page: 1,
        size: 100,
        status: 1,
        projectId: '16bf7387dad2c3ba0966cd61c9ca4ba1'
      }).then((res) => {
        if (res.code === 200) {
          this.users = res.data.list;
        }
      });
    },
    submit() {
      const datas = {
        postilName: this.form.postilName,
        tag: parseInt(this.form.tag),
        buildId: this.$props.buildId,
        companyId: 'd9df15b2319d8a7533ff08542c704829',
        partInUser: JSON.stringify(this.form.partInUser),
        content: this.form.content,
        viewport: JSON.stringify({
          viewId: this.$props.coordinatesL,
          viewIMg: this.$props.imgList
        }),
        projectId: 'res_gaohangyou_20200423'
      };
      addPostilList(datas).then((res) => {
        if (res.code === 200) {
          this.$$message.sucess('新建成功');
          this.form.postilName = '';
          this.form.tag = '';
          this.form.content = '';
          this.form.partInUser = [];
          this.$emit('closepostil', 'getList');
        }
      });
    },
    handleChange(val) {
      const _this = this;
      val.forEach((vals) => {
        var obj = {};
        obj = this.users.find(function (item) {
          return item.id === vals;
        });
        var objs = {
          id: obj.id,
          name: obj.name
        };
        _this.form.partInUser.push(objs);
      });
    },
    callOff(num) {
      if (num === 1) {
        const objs = {
          postilName: this.form.postilName,
          tag: this.form.tag,
          partInUser: this.form.partInUser,
          content: this.form.content
        };
        this.$emit('closepostil', objs);
      } else {
        this.$emit('closepostil', '');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.newpostil {
  .postill {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    .imgBox {
      margin: 0 px2rem(20);
      .enginlist {
        width: px2rem(148);
        height: px2rem(158);
        border: px2rem(1) solid $gre;
        border-radius: px2rem(6);
      }
    }
    .imgBox:first-child,
    :nth-child(5) {
      margin: 0;
    }
    .plus {
      width: px2rem(148);
      height: px2rem(158);
      display: inline-block;
      border: px2rem(1) dashed $greyClolor;
      border-radius: px2rem(6);
    }
    .el-icon-plus::before {
      position: relative;
      top: 41%;
      left: 44%;
      transform: translate(-41%, -44%);
    }
  }
}
</style>
