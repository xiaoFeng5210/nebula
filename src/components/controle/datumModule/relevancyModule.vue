<template>
  <div class="g__box">
    <el-dialog
      title="关联构件"
      :visible="dialogVisible"
      width="90%"
      top="2%"
      :show-close="false"
    >
      <div class="main">
        <div class="directoryTree">
          <div>目录树</div>
          <div class="directory__tree__component">
            <el-tree
              :data="treeData"
              ref="directoryTree"
              show-checkbox
              default-expand-all
              @check-change="handleCheckChange"
              node-key="id">
            </el-tree>
          </div>
        </div>
        <div class="model" id="relevancy">
        </div>
        <div class="selected__components" style="margin-left: 20px;">
          <div>已选构件</div>
          <div class="selected__components__module">
            <el-tree
              :data="treeData"
              ref="selectedTree"
              show-checkbox
              default-expand-all
              node-key="id">
            </el-tree>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getStructureDirectoryClient, getAllBuildIdsClient, findAllBuildIdsClient } from '@/api/datumInterface';
export default {
  name: 'relevancyModule',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 用来判断是新增文件还是在列表中关联时触发的
    isCreateState: {
      type: Boolean
    },
    // 主文件ID
    fileMajorKeyId: {
      type: String
    }
  },
  data() {
    return {
      directoryCheckData: [],
      // 选中的构件ID
      componentIds: [],
      // tree数据
      treeData: [{
        id: 1,
        label: '一级'
      }, {
        id: 2,
        label: '二级'
      }]
    };
  },
  created() {
    this.getStructureDirectory();
    this.findAllBuildIds();
  },
  mounted() {
    this.$nextTick(() => {
      this.getModel();
      document.addEventListener('RealBIMSelModel', this.getCurrentComponent);
    });
  },
  methods: {
    // 查询已经绑定构件ids
    findAllBuildIds() {
      const data = { id: this.fileMajorKeyId };
      findAllBuildIdsClient(data).then(res => {
        if (res.code === 200) {
          console.log(res);
        }
      });
    },
    getAllBuildIds() {
      this.directoryCheckData.forEach((v) => {
        this.componentIds = this.componentIds.concat(v.buildId);
      });
      const currentProjectId = localStorage.getItem('projectId');
      const data = {
        projectId: currentProjectId,
        id: this.fileMajorKeyId,
        componentIds: this.componentIds
      };
      getAllBuildIdsClient(data).then(res => {
        if (res.code === 200) {
          return this.$message.success(res.message);
        } else {
          return this.$message.error(res.message);
        }
      });
    },
    // 获取构件目录树
    getStructureDirectory() {
      const currentProjectId = localStorage.getItem('projectId');
      const data = { projectIds: [currentProjectId] };
      getStructureDirectoryClient(data).then(res => {
        if (res.code === 200) {
          this.treeData = res.data[currentProjectId].children;
        }
      });
    },
    // 获得模型
    getModel() {
      const canvasModel = document.getElementById('model');
      canvasModel.style.display = 'block';
      const relevancy = document.getElementById('relevancy');
      relevancy.append(canvasModel);
    },
    // 鼠标探测事件
    getCurrentComponent() {
      const project = REgetCurProbeRet(); // 获取当前选中点相关参数
      this.buildId = project.m_uSelActorSubID_L32;
    },
    // 获取目录树节点并且设置已选树节点
    handleCheckChange(data, checked, indeterminate) {
      this.directoryCheckData = this.$refs.directoryTree.getCheckedNodes();
      this.$refs.selectedTree.setCheckedNodes(this.directoryCheckData);
    },
    handleConfirm() {
      this.getAllBuildIds();
      // this.saveModel();
      // this.$emit('close-modal');
    },
    handleCancel() {
      this.saveModel();
      this.$emit('close-modal');
    },
    // 当组件销毁之前需要在body中把model保留下来
    saveModel() {
      const canvasModel = document.getElementById('model');
      if (canvasModel) {
        canvasModel.style.display = 'none';
        const body = document.querySelector('body');
        body.append(canvasModel);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.g__box {
  .main {
    display: flex;
    transform: translateX(5%);
    .directoryTree, .selected__components {
      overflow: auto;
      width: px2rem(391);
      height: px2rem(782);
    }
    .model {
      width: px2rem(1005);
      height: px2rem(782);
    }
  }
}
</style>
