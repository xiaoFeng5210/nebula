<template>
  <div ref="organize" class="organize" @scroll="listScroll">
    <div class="module" v-for="(item,index) in tableData" :key="index">
      <div class="scroll">
        <div class="d-flex jc-between ai-center">
          <div class="tabs-title">
            创建人：
            <span>{{item.createUserName}}</span>
          </div>
          <div class="tabs-title">2020-02-03 12:30</div>
        </div>
        <div class="tabs-title">
          批注名称：
          <span>{{item.postilName}}</span>
        </div>
        <div class="tabs-title">
          批注标签：
          <span>{{item.tag}}</span>
        </div>
        <div class="tabs-title">
          批注内容：
          <span>{{item.content}}</span>
        </div>
        <div class="d-flex jc-between ai-center">
          <div class="tabs-title">
            位置描述：
            <span></span>
          </div>
          <div class="tabs-title sends" @click="details(item)">查看详情</div>
        </div>
        <div class="views">
          <img src="../../../assets/model.png" @click="orientation(item.buildId,item.viewport)" />
        </div>
        <div class="comment">
          <div class="comment-serch d-flex jc-between ai-center">
            <div>
              <el-input v-model="desc[index]" placeholder="说点什么"></el-input>
            </div>
            <div class="sends" @click="sends(item,index)">发送</div>
            <div class="sends" @click="getlists(index)">评论( {{item.count}})</div>
          </div>
          <div class="discuss" :ref="'discuss${index}'" @scroll="discusScroll(index)">
            <div
              class="tabs-title d-flex jc-between ai-center"
              v-for="(items,indexs) in item.bbsList"
              :key="indexs"
            >
              <div>
                {{items.createUserName}}：
                <span>{{items.content}}</span>
              </div>
              <div class="dels" @click="deltes(item.id,items.id,index)">删除</div>
            </div>
            <!-- <div class="all">查看更多</div> -->
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
    posTiList: Array
  },
  data() {
    return {
      tableData: [],
      page: 1,
      size: 10,
      desc: [],
      total: 0,
      count: 0
    };
  },
  created() {
    const _this = this;
    _this.tableData = _this.$props.posTiList;
  },
  methods: {
    details(objs) {
      this.$emit('showDetil', JSON.stringify(objs));
    },
    getlists(nums) {
      const _this = this;
      const datas = {
        page: _this.page,
        size: _this.size,
        type: 1,
        sceneId: _this.tableData[nums].id
      };
      getDiscussList(datas).then((res) => {
        if (res.code === 200) {
          _this.tableData[nums].bbsList = res.data.list;
          _this.count = res.data.total;
        }
      });
    },
    listScroll() {
      const sheis = this.$refs.organize.scrollHeight;
      const heis = this.$refs.organize.clientHeight;
      const stops = this.$refs.organize.scrollTop;
      if (stops + heis >= sheis) {
        if (this.page < this.total / this.size) {
          this.page++;
          this.$emit('currentChange', this.page);
        }
      } else if (stops <= 1 && this.page !== 1) {
        this.page--;
        this.$emit('currentChange', this.page);
      }
    },
    discusScroll(index) {
      const sheis = this.$refs['discuss${index}'].scrollHeight;
      const heis = this.$refs['discuss${index}'].clientHeight;
      const stops = this.$refs['discuss${index}'].scrollTop;
      if (stops + heis >= sheis) {
        this.page++;
        this.getlists(index);
      }
    },
    sends(obj, index) {
      const _this = this;
      if (_this.desc.length === 0) {
        _this.$message.error('请输入评论内容');
      } else {
        const datas = {
          projectId: 'res_gaohangyou_20200423',
          companyId: localStorage.getItem('companyId'),
          type: 1,
          sceneId: obj.id,
          content: _this.desc[index]
        };
        httpAddDiscuss(datas).then((res) => {
          if (res.code === 200) {
            _this.desc[index] = '';
            _this.getlists(index);
          }
        });
      }
    },
    deltes(sceneId, itemId, index) {
      const datas = {
        id: itemId,
        sceneId: sceneId
      };
      deleteDiscuss(datas).then((res) => {
        if (res.code === 200) {
          this.getlists(index);
        }
      });
    },
    orientation(bil, view) {
      REfocusCamTo(bil, 2.0);
      REaddToSelElemIDs(bil);
    }
  },
  watch: {
    posTiList() {
      this.tableData = this.$props.posTiList;
    }
  }
};
</script>

<style lang="scss" scoped>
.organize {
  max-height: px2rem(800);
  overflow: auto;
  .module {
    width: 100%;
    color: $deepGre;
    padding: px2rem(20);
    padding-bottom: 0;
    .sends {
      color: $font;
      cursor: pointer;
      font-size: px2rem(14);
    }
    .tabs-title {
      line-height: px2rem(26);
      font-size: px2rem(14);
      .dels {
        cursor: pointer;
        color: $absColor;
      }
    }
    .all {
      cursor: pointer;
      font-size: px2rem(16);
      color: $font;
    }
    span {
      color: $gre;
    }
    .views {
      img {
        width: 100%;
      }
    }
    .comment {
      .comment-serch {
        margin: px2rem(10) 0;
        /deep/ .el-input {
          width: px2rem(180);
          margin-right: px2rem(10);
          input {
            font-size: px2rem(14);
            height: px2rem(38) !important;
            padding: 0 px2rem(10);
          }
        }
        .el-button {
          margin-left: px2rem(20);
        }
      }
      .discuss {
        max-height: px2rem(200);
        overflow: auto;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
        -webkit-overflow-style: none; /* IE 10+ */
      }
      .discuss::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    }
  }
}
</style>
