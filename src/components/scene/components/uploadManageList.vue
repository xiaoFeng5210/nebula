<template>
    <div class="list-gox">
      <div class="tops">
        <div class="title">
          上传列表
        </div>
        <div class="title__button">
          <el-button class="dangers" type="danger" plain size="small">删除</el-button>
          <el-button type="primary" size="small">自动关联</el-button>
          <el-button type="primary" size="small">批量上传</el-button>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="fileName" label="文件名称"></el-table-column>
        <el-table-column prop="date" label="上传时间"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button class="dangers" type="danger" plain size="small">删除</el-button>
          </template>
          <template>
            <el-button type="success" size="small">更新</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
export default {
  name: 'uploadManageList',
  data() {
    return {
      tableData: [{
        fileName: '秉匠科技',
        date: '2020-05-10'
      }]
    };
  }
};
</script>

<style scoped lang="scss">
.g-box {
  .tops {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid $bors;
    margin-left: px2rem(10);
    padding: px2rem(10);
    color: $selfTitle;
    font-size: px2rem(16);
    .title {
      margin-top: px2rem(24);
      font-size: px2rem(20);
      color: $treeColor;
    }
  }
  /deep/.el-table td {
    text-align: center;
    .dangers {
      border-color: $btnbor;
      color: $btnhover;
      background: $btnbor;
    }
    .dangers:hover {
      color: $bgColor;
      border-color: $btnhover;
      background: $btnhover;
    }
  }
}
</style>
