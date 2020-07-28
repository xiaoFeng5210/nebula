<template>
  <div class="logmain">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="账号名称"></el-table-column>
      <el-table-column prop="type" label="模块分类"></el-table-column>
      <el-table-column prop="menu" label="模块菜单"></el-table-column>
      <el-table-column prop="act" label="操作动作"></el-table-column>
      <el-table-column prop="content" label="记录内容"></el-table-column>
      <el-table-column prop="date" label="记录日期"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: '',
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          type: '项目管理',
          menu: '项目列表',
          act: '新建但项目',
          content: '新建了名称为“123”的文件'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          type: '项目管理',
          menu: '项目列表',
          act: '新建但项目',
          content: '新建了名称为“123”的文件'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          type: '项目管理',
          menu: '项目列表',
          act: '新建但项目',
          content: '新建了名称为“123”的文件'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          type: '项目管理',
          menu: '项目列表',
          act: '新建但项目',
          content: '新建了名称为“123”的文件'
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.logmain {
  background-color: $bgColor;
  padding: px2rem(10);
  box-sizing: border-box;
  .listrow {
    padding: 10px 0;
    border-bottom: 1px #ccc solid;
  }
  .listleft {
    width: 80px;
    float: left;
  }
  .marginleft {
    margin-left: 10px;
  }
}
</style>
