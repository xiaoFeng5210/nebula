<template>
  <div class="discussPotil bg-white">
    <div class="header d-flex jc-between ai-center">
      <div class="left-head">
        <span class="line"></span>
        <span class="titles">批注管理</span>
      </div>
      <el-button size="mini" plain type="primary" @click="backs">返回</el-button>
    </div>
    <div class="container bg-white">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="1">
          <ul>
            <li>批注名称：{{idsDetil.postilName}}</li>
            <li>创建人：{{idsDetil.partInUser.name}}</li>
            <li>创建时间：2019-12-07 15:00:45</li>
          </ul>
        </el-collapse-item>
        <el-collapse-item title="批注视口" name="2">
          <img v-for="(item,index) in idsDetil.viewport" :key="index" />
        </el-collapse-item>
        <el-collapse-item title="参与人" name="3">
          <div>
            <img /> 李四
          </div>
        </el-collapse-item>
        <el-collapse-item title="批注内容" name="4">
          <div>{{idsDetil.content}}</div>
        </el-collapse-item>
      </el-collapse>
      <div class="comment">
        <div class="title">评论（{{count}}）</div>
        <div class="sdddd d-flex jc-between ai-center">
          <el-input type="text" v-model="desc"></el-input>
          <el-button @click="sends" size="mini" type="primary">发表</el-button>
        </div>
        <div class="com-container">
          <div
            class="com-module d-flex jc-start ai-center"
            v-for="(items,index) in commentList"
            :key="index"
          >
            <div class="com-img">
              <img src="../../../assets/model.png" />
            </div>
            <div class="right-con">
              <div class="d-flex jc-between ai-center">
                <div>{{items.createUserName}}</div>
                <div>{{items.createTime}}</div>
              </div>
              <div class="d-flex jc-between ai-center">
                <div>{{items.content}}</div>
                <el-button @click="deltes(items.id)" size="mini" plain type="danger">删除</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getDiscussList,
  httpAddDiscuss,
  deleteDiscuss
} from '@/api/tagboxApi/tagboxApi';
export default {
  props: {
    idsDetils: String
  },
  data() {
    return {
      activeNames: ['1'],
      idsDetil: JSON.parse(this.$props.idsDetils),
      commentList: [],
      desc: '',
      page: 1,
      size: 10,
      count: 0
    };
  },
  created() {
    this.comment();
  },
  mounted() {},
  methods: {
    comment() {
      const _this = this;
      const datas = {
        page: _this.page,
        size: _this.size,
        type: 1,
        sceneId: _this.idsDetil.id
      };
      getDiscussList(datas).then(res => {
        if (res.code === 200) {
          _this.commentList = res.data.list;
          _this.count = res.data.total;
        }
      });
    },
    sends() {
      const _this = this;
      if (_this.desc === ' ') {
        _this.$message.error('请输入评论内容');
      } else {
        const datas = {
          projectId: localStorage.getItem('projectId'),
          companyId: localStorage.getItem('companyId'),
          type: 1,
          sceneId: _this.idsDetil.id,
          content: _this.desc
        };
        httpAddDiscuss(datas).then(res => {
          if (res.code === 200) {
            this.desc = '';
            this.comment();
          }
        });
      }
    },
    backs() {
      this.$emit('closedetial');
    },
    deltes(itemId) {
      const datas = {
        id: itemId,
        sceneId: this.idsDetil.id
      };
      deleteDiscuss(datas).then(res => {
        if (res.code === 200) {
          this.comment();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.discussPotil {
  width: 100%;
  height: 92.5vh;
  margin-left: px2rem(10);
  .header {
    height: px2rem(60);
    line-height: px2rem(60);
    margin-left: px2rem(10);
    padding: 0 px2rem(20);
    background: $bgColor;
    .left-head {
      .line {
        width: px2rem(2);
        height: px2rem(16);
        display: inline-block;
        background: $font;
      }
      .titles {
        margin-left: px2rem(10);
      }
    }
  }
  .container {
    padding: px2rem(20);
    .comment {
      width: 60%;
      .title {
        color: $gre;
        font-size: px2rem(18);
        padding: px2rem(20) 0;
      }
      .el-input {
        width: 90%;
      }
      .com-container {
        max-height: px2rem(460);
        overflow: auto;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
        -webkit-overflow-style: none; /* IE 10+ */
        .com-module {
          margin: px2rem(20) 0;
          border-bottom: px2rem(1) solid $greyClolor;
          .com-img {
            margin: px2rem(10);
            img {
              width: px2rem(50);
              height: px2rem(50);
              border-radius: 50%;
            }
          }
          .right-con {
            width: 100%;
            font-size: px2rem(16);
            line-height: px2rem(24);
          }
        }
      }
      .com-container ::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    }
  }
}
</style>
