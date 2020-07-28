<template>
  <div class="tabList infinite-list-wrapper">
    <el-table
      default-expand-all
      :data="dataList"
      v-loading="loading"
      v-infinite-scroll="load"
      infinite-scroll-disabled="disabled"
      @row-click="rowClick"
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
      <el-table-column prop="projectName" label="项目名称" width="200" sortable></el-table-column>
      <el-table-column prop="projectTag" label="项目类型"></el-table-column>
      <el-table-column prop="projectEngineModelNum" label="项目/模型数量"></el-table-column>
      <el-table-column prop="projectEngineModelSize" label="项目/模型大小"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click.stop="handleEdit(scope.row)">设置</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { projectAll } from '../../api/proApi/index';
import { mapGetters } from 'vuex';
export default {
  name: 'tablist',
  props: {},
  data() {
    return {
      loading: false,
      dataList: [],
      singleData: [],
      singlenum: 0,
      groupData: [],
      groupnum: 0,
      param: {
        companyId: localStorage.getItem('companyId'),
        sort: '23',
        content: ''
      }
    };
  },
  computed: { ...mapGetters(['isload', 'searchobj']) },
  watch: {
    isload: function(val) {
      if (val) {
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
    handleEdit(item) {
      item = JSON.stringify(item);
      this.$emit('modifydialog', {
        type: 'modify',
        item
      });
    },
    rowClick(item) {
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
    getprojectList() {
      this.loading = true;
      projectAll(this.param).then(res => {
        if (res.code === 200 && res.data) {
          this.singleData = res.data.singleList;
          this.groupData = res.data.groupList;
          this.dataList = this.singleData.concat(this.groupData);
          this.singlenum = res.data.singleCount;
          this.groupnum = res.data.groupCount;
        }
        this.loading = false;
      });
    },
    load() {
      this.loading = true;
      this.getprojectList();
    }
  }
};
</script>
<style lang="scss" scoped>
.tabList {
  width: 100vw;
  height: px2rem(960);
  overflow: auto;
  padding: 0 px2rem(30);
  .textcenter {
    text-align: center;
  }
}
</style>
