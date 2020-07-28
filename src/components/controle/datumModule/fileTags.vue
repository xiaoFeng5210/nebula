<template>
    <div class="g__box">
      <el-dialog
        title="已选标签"
        :visible="dialogVisible"
        width="23%"
        :show-close="false"
      >
        <div class="tags__header" v-if="selectedTags.length > 0">
          <div class="file__tags">
            <div class="tag" v-for="(tag, index) in selectedTags" :key="index" @click="deleteSelectedTag(tag, index)">
              <div class="tag__color" :style="{ background: tag.tagColor }"></div>
              <div class="tag__text">{{tag.tagName}}</div>
            </div>
          </div>
        </div>
        <div class="tags__content">
          <div class="file__tags__content">
            <div class="tag__row" v-for="(item, index) in allTags" :key="index">
              <el-row>
                <el-col :span="4">
                  <div class="tag__row__color" :style="{ background: item.tagColor }"></div>
                </el-col>
                <el-col :span="13">
                  <div class="tag__row__name" v-if="changeTab !== index">{{item.tagName}}</div>
                  <div class="file__input" v-if="changeTab === index">
                    <el-input size="mini" placeholder="请输入标签名字" style="width: 130px;"
                              v-model="updateTag.tagName"></el-input>
                    <i class="el-icon-check"
                       style="font-size: 18px; margin-right: 6px; cursor: pointer"  @click="handleUpdateTag"></i>
                    <i class="el-icon-close" style="font-size: 18px; cursor: pointer" @click="cancelEditTag"></i>
                  </div>
                </el-col>
                <el-col :span="7">
                  <div class="tag__row__edit" style="margin-top: 4px;">
                    <el-link type="primary" @click="editTag(item, index)">编辑</el-link>
                    <el-link type="primary" style="margin-left: 4px;" @click="chooseTag(item, index)">选择</el-link>
                    <el-link type="danger" style="margin-left: 4px;" @click="deleteTag(item)">删除</el-link>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="add__new__tag" v-if="prepareAddTag">
          <div class="new__tag__box">
            <span>标签名称：</span>
            <el-input size="mini" placeholder="请输入标签名称" style="width: 200px;"
                      v-model="newTagName"></el-input>
          </div>
          <div class="color__select">
            <div class="color__style" v-for="(item, index) in allColors" :key="index"
                 @click="selectColor(item, index)" :style="{ background: item }">
              <i class="el-icon-check" style="font-size: 18px; color: white; margin-top: 5px;vertical-align: baseline;"
                 v-show="colorSelect === index"></i>
            </div>
          </div>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="addNew" v-if="!prepareAddTag">新增标签</el-button>
        <el-button type="primary" @click="createNewTag" v-if="prepareAddTag">添加新标签</el-button>
        <el-button type="primary" @click="bindAllTags">绑定标签</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
import { getAllTagsColorClient, getAllTagsClient, addNewTagClient, editTagClient, deleteTagClient, bindTagClient } from '@/api/datumInterface';
export default {
  name: 'fileTags',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 需要传入tags
    tags: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 文件信息
    fileInfo: {
      type: Object
    },
    // 判断是编辑还是新增文件时触发该组件的
    isEditState: {
      type: Boolean
    }
  },
  data() {
    return {
      tagIds: [],
      updateTag: {
        id: '',
        tagName: '',
        tagColor: ''
      },
      // 当前文件下已选的标签
      selectedTags: [],
      allTags: [],
      prepareAddTag: false,
      allColors: [],
      // 要编辑或者删除的标签
      changeTab: -1,
      // 选中的颜色
      colorsSelected: '',
      colorSelect: -1,
      isTagEdit: false,
      newTagName: '',
      editTagName: ''
    };
  },
  created() {
    this.getAllTags();
    this.getAllColor();
  },
  mounted() {
    this.selectedTags = this.selectedTags.concat(this.tags);
  },
  methods: {
    // 获取当前项目下所有的标签
    getAllTags() {
      const data = { projectId: 'res_eddqbim' };
      getAllTagsClient(data).then(res => {
        if (res.code === 200) {
          this.allTags = res.data.list;
        } else {
          return this.$message.error(res.message);
        }
      });
    },
    // 绑定标签
    bindAllTags() {
      this.selectedTags.forEach((v) => {
        this.tagIds.push(v.id);
      });
      if (this.isEditState) {
        const data = {
          tagIds: this.tagIds,
          projectId: 'res_eddqbim',
          id: this.fileInfo.id
        };
        bindTagClient(data).then(res => {
          if (res.code === 200) {
            return this.$message.success(res.message);
          } else {
            return this.$message.error(res.message);
          }
        }).finally(() => {
          this.$emit('close-tag');
          this.$emit('get-data');
          this.$emit('change-state');
        });
      } else {
        this.$emit('get-tags', this.tagIds);
        this.$emit('close-tag');
      }
    },
    createNewTag() {
      const data = {
        projectId: 'res_eddqbim',
        tagName: this.newTagName,
        tagColor: this.colorsSelected
      };
      addNewTagClient(data).then(res => {
        if (res.code === 200) {
          this.$message.success('添加成功');
          this.getAllTags();
        } else if (res.code === 1) {
          return this.$message.error(res.message);
        }
      });
    },
    // 删除已选标签
    deleteSelectedTag(item, index) {
      console.log(index);
      this.selectedTags.splice(index, 1);
    },
    addNew() {
      this.prepareAddTag = true;
    },
    selectColor(item, index) {
      this.colorSelect = index;
      this.colorsSelected = item;
    },
    getAllColor() {
      getAllTagsColorClient().then(res => {
        if (res.code === 200) {
          this.allColors = res.data;
        } else {
          return this.$message.error(res.message);
        }
      });
    },
    // 取消修改
    cancelEditTag() {
      this.changeTab = -1;
    },
    handleUpdateTag() {
      const data = { ...this.updateTag, projectId: 'res_eddqbim' };
      editTagClient(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.changeTab = -1;
          this.getAllTags();
        } else if (res.code === 1) {
          return this.$message.error(res.message);
        } else {
          return this.$message.error(res.message);
        }
      });
    },
    // 编辑tag
    editTag(item, index) {
      this.changeTab = index;
      this.updateTag.id = item.id;
      this.updateTag.tagName = item.tagName;
      this.updateTag.tagColor = item.tagColor;
    },
    chooseTag(item) {
      this.selectedTags.push(item);
    },
    // 删除tag
    deleteTag(item) {
      const data = { id: item.id };
      deleteTagClient(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getAllTags();
        } else {
          return this.$message.error(res.message);
        }
      });
    },
    handleCancel() {
      this.$emit('change-state');
      this.$emit('close-tag');
    }
  }
};
</script>

<style scoped lang="scss">
.g__box {
  .add__new__tag {
    width: 90%;
    margin-top: px2rem(6);
    margin-left: px2rem(85);
    .color__select{
      white-space: nowrap;
      margin-left: px2rem(47);
      margin-top: px2rem(10);
      width: px2rem(300);
      height: px2rem(65);
      overflow-x: auto;
      overflow-y: hidden;
      ::-webkit-scrollbar {display:none}
      .color__style {
        text-align: center;
        display: inline-block;
        margin-right: px2rem(20);
        width: px2rem(32);
        height: px2rem(32);
        border-radius: 50%;
      }
    }
  }
  .tags__content {
    margin-top: px2rem(6);
    margin-left: px2rem(50);
    .file__tags__content {
      width: 90%;
      height: px2rem(140);
      overflow: auto;
      .tag__row {
        margin-bottom: px2rem(6);
      }
      .file__input {
        display: inline-block;
      }
      .tag__row__color {
        width:px2rem(21);
        transform: translateX(35px);
        height:px2rem(21);
        border-radius:50%;
      }
      .tag__row__edit {
        display: flex;
      }
    }
  }
  .tags__header {
    border-bottom: 1px solid $selfbor;
    padding-bottom: px2rem(5);
    .file__tags {
      cursor: pointer;
      display: flex;
      .tag {
        margin-right: px2rem(7);
        display: flex;
        padding-left: px2rem(6);
        padding-right: px2rem(6);
        padding-top: px2rem(6);
        padding-bottom: px2rem(6);
        background-color:$borderBg;
        border-radius:px2rem(12);
        .tag__color {
          transform: translateY(30%);
          width:px2rem(11);
          height:px2rem(11);
          background:rgba(0,152,255,1);
          border-radius:50%;
        }
        .tag__text {
          font-size:px2rem(12);
          font-weight:normal;
        }
      }
    }
  }
}
</style>
