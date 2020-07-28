<template>
    <div class="g__box">
      <el-dialog :title="title" :visible="dialogVisible" width="27%" :show-close="false">
        <el-tree
          :props="props"
          ref="directoryTree"
          show-checkbox
          :load="loadNode"
          check-strictly
          lazy
          @check-change="handleCheckChange">
        </el-tree>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
import { copyMoveQueryClient, moveToClient, copyToClient } from '@/api/datumInterface';
export default {
  name: 'moveAndCopyModule',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    isMoveOrCopy: {
      type: String
    },
    // 需要传入一个parentId
    tableQuery: {
      type: Object
    },
    // 右键传入的行数据
    row: {
      type: Object
    },
    // 点击头部获取的数据
    currentData: {
      type: Object
    },
    // 用来区分是右击还是头部点击
    moveType: {
      type: String
    }
  },
  data() {
    return {
      props: {
        label: 'name',
        children: 'zones'
      },
      childNodeData: [],
      // 需要移动/复制到的文件夹id
      parentId: null
    };
  },
  computed: {
    title() {
      return this.isMoveOrCopy === 'move' ? '移动文件' : '复制文件';
    }
  },
  methods: {
    // 选框变化时的事件
    handleCheckChange(data, checked) {
      console.log(data);
      if (checked) { this.parentId = data.id; }
    },
    // 节点懒加载
    loadNode(node, resolve) {
      const _this = this;
      if (node.level === 0) {
        return resolve([{ name: '所有文件', id: -1 }]);
      }
      _this.interfaceDirectory(node.data.id).then(data => {
        setTimeout(() => {
          if (data) {
            resolve(data);
          }
        }, 200);
      });
    },
    // 公用的请求目录的接口
    interfaceDirectory(id) {
      return new Promise((resolve, reject) => {
        const data = {
          projectId: this.tableQuery.projectId,
          parentId: id
        };
        copyMoveQueryClient(data).then(res => {
          if (res.code === 200) {
            this.childNodeData = res.data.list;
            this.childNodeData.forEach((v) => {
              v.name = v.fileName;
            });
            const childNodeData = this.childNodeData;
            resolve(childNodeData);
          } else {
            this.$message.error(res.message);
            reject(res.message);
          }
        });
      });
    },
    // 右击弹窗移动
    rightMoveToDirectory() {
      const data = {
        parentId: this.parentId,
        id: this.row.id
      };
      this.interfaceMoveTo(data);
    },
    // 头部点击移动
    headMoveToDirectory() {
      const data = {
        parentId: this.parentId,
        id: this.currentData.id
      };
      this.interfaceMoveTo(data);
    },
    // 移动文件接口封装
    interfaceMoveTo(data) {
      const dto = this.isMoveOrCopy === 'move' ? moveToClient : copyToClient;
      dto(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.$emit('update-list');
        } else {
          return this.$message.error(res.message);
        }
      }).finally(() => {
        this.$emit('close-tip');
      });
    },
    handleConfirm() {
      if (this.moveType === 'rightMove') {
        this.rightMoveToDirectory();
      } else {
        this.headMoveToDirectory();
      }
      this.$emit('close-modal');
    },
    handleCancel() {
      this.$emit('close-tip');
      this.$emit('close-modal');
    }
  }
};
</script>

<style scoped>

</style>
