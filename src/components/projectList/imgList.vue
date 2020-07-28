<template>
  <div class="imgList infinite-list-wrapper">
    <ul
      v-if="Number(groupnum)>0"
      class="list marginbtm"
      v-infinite-scroll="load"
      infinite-scroll-disabled="disabled"
    >
      <li class="item" v-for="item in groupData" :key="item.id" @click="handleclick(item)">
        <img src="../../assets/icon/protag.png" class="tag" alt srcset />
        <p class="imgtitle">{{item.projectName}}</p>
        <el-image :src="basesrc+item.projectImg" class="imgsize"></el-image>
        <p>
          <span>模型数量：{{item.projectEngineModelNum}}个</span>
          <span>模型大小：{{item.projectEngineModelSize}}G</span>
        </p>
        <p>
          <span>创建时间：{{item.createTime}}</span>
          <img
            src="../../assets/icon/clsz.png"
            alt
            srcset
            class="setimg"
            @click.stop="modifyDialog(item)"
          />
        </p>
      </li>
    </ul>
    <ul
      class="list"
      v-if="Number(singlenum)>0"
      v-infinite-scroll="load"
      infinite-scroll-disabled="disabled"
    >
      <li class="item" v-for="item in singleData" :key="item.id" @click="handleclick(item)">
        <p class="imgtitle">{{item.projectName}}</p>
        <el-image :src="basesrc+item.projectImg" class="imgsize"></el-image>
        <p>
          <span>模型数量：{{item.projectEngineModelNum}}个</span>
          <span>模型大小：{{item.projectEngineModelSize}}G</span>
        </p>
        <p>
          <span>创建时间：{{item.createTime}}</span>
          <img
            src="../../assets/icon/clsz.png"
            alt
            srcset
            class="setimg"
            @click.stop="modifyDialog(item)"
          />
        </p>
      </li>
    </ul>
    <p class="textcenter" v-if="(Number(singlenum)<1 && Number(groupnum)<1) && isshow">暂无信息</p>
    <p class="textcenter" v-if="loading">加载中...</p>
    <p
      v-if="(noMore && (Number(singlenum)>0)) && (noMore && (Number(groupnum)>0))"
      class="textcenter"
    >没有更多了</p>
  </div>
</template>
<script>
import { projectAll } from '../../api/proApi/index';
import { mapGetters } from 'vuex';
export default {
  name: 'imglist',
  data() {
    return {
      loading: false,
      singleData: [],
      singlenum: 0,
      groupData: [],
      groupnum: 0,
      isshow: false,
      // dataObj: {
      //   companyId: localStorage.getItem('companyId'),
      //   sort: '23',
      //   content: ''
      // },
      param: {
        companyId: localStorage.getItem('companyId'),
        sort: '23',
        content: ''
      },
      basesrc: 'api/bjfiles/filesFilter/'
    };
  },
  computed: {
    ...mapGetters(['isload', 'searchobj']),
    noMore() {
      return (
        this.singleData.length >= this.singlenum &&
        this.groupData.length >= this.groupnum
      );
    },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  watch: {
    isload: function(val) {
      if (val) {
        // this.$store.commit('setload')
        this.getprojectList();
      }
    },
    searchobj: function(val) {
      if (val) {
        this.param = Object.assign(this.param, val);
        this.getprojectList();
      }
    }
  },
  mounted() {
    this.getprojectList();
  },
  methods: {
    getprojectList() {
      projectAll(this.param).then(res => {
        if (res.code === 200 && res.data) {
          this.singleData = res.data.singleList;
          this.groupData = res.data.groupList;
          this.singlenum = res.data.singleCount;
          this.groupnum = res.data.groupCount;
        }
        this.isshow = true;
      });
    },
    load() {
      this.loading = true;
      this.getprojectList();
    },
    handleclick(item) {
      this.$router.push({
        path: '/tableMain',
        query: {
          id: item.id,
          companyId: item.companyId
        }
      });
      localStorage.setItem('projectName', item.projectName);
      localStorage.setItem('projectId', item.id)
    },
    modifyDialog(item) {
      item = JSON.stringify(item);
      this.$emit('modifydialog', {
        type: 'modify',
        item
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.imgList {
  width: px2rem(1840);
  height: px2rem(960);
  overflow: auto;
  margin: 0 auto;
  .list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .item {
      border-radius: px2rem(10);
      box-sizing: border-box;
      background: #fff;
      height: px2rem(400);
      padding: px2rem(10) px2rem(20);
      font-size: px2rem(14);
      margin-bottom: px2rem(30);
      margin-right: px2rem(25);
      position: relative;
      .tag {
        position: absolute;
        left: 0;
        top: 0;
        height: px2rem(60);
      }
      .imgtitle {
        font-size: px2rem(20);
        font-weight: 700;
      }
      .imgsize {
        display: block;
        height: px2rem(230);
        width: px2rem(300);
      }
      .setimg {
        display: block;
      }
      p {
        display: flex;
        justify-content: space-between;
      }
    }
    .item:nth-child(5n) {
      margin-right: 0;
    }
  }
  .textcenter {
    text-align: center;
  }
  .marginbtm {
    margin-bottom: px2rem(30);
    border-bottom: 1px #ccc solid;
  }
}
</style>
