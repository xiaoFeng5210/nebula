<template>
  <div class="progress_box">
    <commonHead></commonHead>
    <div class="container d-flex jc-between">
      <!-- 模型转换 -->
      <div class="model_box bg-white">
        <div class="self-title d-flex jc-between">
          <div>
            <i class="bg-primary"></i>
            模型转换
          </div>
          <div>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="startModel"
              v-if="this.type === 1"
            >开始</el-button>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="startModel"
              v-else-if="this.type === 2"
            >暂停</el-button>
          </div>
        </div>
        <div class="transform">
          <div class="list">
            <div class="model_list">
              <div class="list-box d-flex">
                <div class="model_img">
                  <img src="../assets/fileType/pak.png" alt />
                </div>
                <div class="model_name">一层建筑平面图.pak</div>
                <div class="model_size">16.7M</div>
                <div class="model_pro">
                  <el-progress :percentage="percentage"></el-progress>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="complete">
          <div></div>
        </div>
      </div>
      <!-- 资料传输 -->
      <div class="model_box bg-white">
        <div class="self-title">
          <i class="bg-primary"></i>
          资料传输
        </div>
        <div class="transform">
          <div class="list"></div>
        </div>
        <div class="complete">
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { modelProgress, successList, stopUpload } from '@/api/global';
export default {
  name: 'progress',
  data() {
    return {
      percentage: 50,
      listQuery: {
        projectId: localStorage.getItem('projectId'),
        page: 1,
        size: 6,
        fileStatus: 4
      },
      type: '',
      allList: [],
      completeList: []
    };
  },
  mounted() {
    this.getModelProgress();
    this.getSuccessList();
  },
  methods: {
    getModelProgress() {
      modelProgress(this.listQuery.projectId).then((res) => {
        if (res.code === 200) {
          this.allList = res.data;
          this.allList.forEach(item => {
            const strItem = JSON.stringify(item.fileStatus);
            if (strItem.indexOf('6') > -1) {
              // 终止状态
              this.type = 1;
            } else if (strItem.indexOf('3') > -1) {
              // 转换中
              this.type = 2;
            }
          });
        }
      });
    },
    // 获取上传成功列表
    getSuccessList() {
      successList(this.listQuery).then((res) => {
        if (res.code === 200) {
          this.completeList = res.data.list;
        }
      });
    },
    startModel() {
      stopUpload({ projectId: this.listQuery.projectId, type: this.type }).then(
        (res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            });
          }
        }
      );
    },
    stopModel() {}
  }
};
</script>

<style lang="scss" scoped>
.progress_box {
  position: relative;
  width: 100vw;
  height: 100vh;
  .container {
    padding: 0 px2rem(10);
    .model_box {
      width: 49%;
      height: 100vh;
      border-radius: px2rem(3);
      font-size: px2rem(13);
      .self-title {
        height: px2rem(69);
        line-height: px2rem(69);
        color: $selfTitle;
        font-size: px2rem(18);
        padding: 0 px2rem(36);
        i {
          width: px2rem(4);
          height: px2rem(18);
          margin: px2rem(-2) px2rem(10);
          display: inline-block;
        }
      }
      .transform {
        margin: 0 px2rem(10);
        height: px2rem(641);
        border-top: 1px solid rgba(179, 184, 186, 0.5);
        border-bottom: 1px solid rgba(179, 184, 186, 0.5);
        .list {
          margin: 0 px2rem(42);
          .model_list {
            .list-box {
              height: px2rem(50);
              line-height: px2rem(50);
              .model_img {
                width: px2rem(22);
                height: px2rem(28);
                margin-top: px2rem(5);
              }
              .model_name {
                margin: 0 px2rem(40);
              }
              .model_size {
                margin: 0 px2rem(40);
              }
            }
          }
        }
      }
      .complete {
        margin: 0 px2rem(42);
      }
    }
  }
}
</style>
