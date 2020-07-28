<template>
  <div class="listTable">
    <div class="module d-flex jc-start ai-center" v-for="(item,index) in rowData" :key="index">
      <el-checkbox :true-label="item.id" :false-label="index" @change="checkS"></el-checkbox>
      <div class="imgs" @click="details(item)">
        {{item.viewport.viewIMg}}
        <img :src="item.viewport.viewIMg" />
      </div>
      <div class="list-module" @click="details(item)">
        <div class="list-title">{{item.postilName}}</div>
        <div class="list-content text-dark">{{item.content}}</div>
        <div class="list-row d-flex jc-start ai-center">
          <div>
            创建日期：
            <span>2019-05-12 12:36</span>
          </div>
          <div>
            创建人：
            <span>{{item.partInUser.name}}</span>
          </div>
          <div>
            评论（
            <span>{{item.count}}</span>）
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { delPostilList } from '@/api/postil';
export default {
  name: 'listTable',
  props: {
    posTiList: Array
  },
  data() {
    return {
      rowData: [],
      isCheck: [],
      checked: ''
    };
  },
  mounted() {},
  methods: {
    checkS(val) {
      if (typeof val === 'string') {
        this.isCheck.push(val);
      } else {
        this.isCheck.slice(val, 1);
      }
    },
    details(objs) {
      this.$emit('showDetil', JSON.stringify(objs));
    },
    deletas() {
      delPostilList({ ids: this.isCheck }).then(res => {
        if (res.code === 200) {
          this.$emit('getList');
        }
      });
    }
  },
  watch: {
    posTiList() {
      this.rowData = this.$props.posTiList;
    }
  }
};
</script>

<style lang="scss" scoped>
.listTable {
  .module {
    padding: px2rem(10);
    .imgs {
      img {
        width: px2rem(147);
        height: px2rem(104);
        padding: px2rem(6);
        cursor: pointer;
      }
    }
    .list-module {
      width: 100%;
      height: px2rem(100);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-content: flex-start;
      line-height: px2rem(26);
      .list-title {
        color: #000;
        font-size: px2rem(14);
      }
      .list-content {
        margin: px2rem(10) 0;
        font-size: px2rem(13);
      }
      .list-row {
        color: $deepGre;
        font-size: px2rem(13);
      }
    }
  }
}
</style>
