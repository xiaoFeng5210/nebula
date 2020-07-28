<template>
  <div class="g-box">
    <el-dialog
      :modal="false"
      title="新建标记"
      :visible="dialogVisible"
      width="27%"
      :show-close="false"
    >
      <el-form ref="createBadgeForm" :model="createBadgeForm" label-position="right" label-width="110px">
        <el-form-item label="标记类型：">
<!--          <el-input v-model="createBadgeForm.type" size="small">-->
<!--            <template slot="prepend"><img-->
<!--              :src="badgeImage" style="height: 23px;" alt="" @click="badgeImageVisible"></template>-->
<!--          </el-input>-->
          <img :src="badgeImage[createBadgeForm.type]" alt="" style="height: 23px; margin-right: 10px; vertical-align: middle">
          <el-select v-model="createBadgeForm.type" placeholder="全部" @change="changeBadge">
            <el-option
              v-for="item in badgeType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="标记图片：" v-if="isBadgeImageVisible">-->
<!--          <div style="display: inline-block;">-->
<!--            <img src="../../assets/badge/blue.png" style="height: 23px; margin-right: 10px;"-->
<!--                 alt="" @click="handleChangeBadgeImage('blue')">-->
<!--            <img src="../../assets/badge/red.png" style="height: 23px; margin-right: 10px;"-->
<!--                 alt="" @click="handleChangeBadgeImage('red')">-->
<!--            <img src="../../assets/badge/green.png" style="height: 23px; margin-right: 10px;"-->
<!--                 alt="" @click="handleChangeBadgeImage('green')">-->
<!--            <img src="../../assets/badge/yellow.png" style="height: 23px;"-->
<!--                 alt="" @click="handleChangeBadgeImage('yellow')">-->
<!--          </div>-->
<!--        </el-form-item>-->
        <el-form-item label="标记名称：" placeholder="请输入标记名称">
          <el-input v-model="createBadgeForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="位置描述：" placeholder="请输入位置描述">
          <el-input v-model="createBadgeForm.location" size="small"></el-input>
        </el-form-item>
        <el-form-item label="选择构件：">
          <span>构件ID： {{buildId}}</span>
          <span class="edit__build" @click="edit">重新选择</span>
        </el-form-item>
        <el-form-item label="标记描述：">
          <el-input type="textarea"
                    :rows="2"
                    v-model="createBadgeForm.description" size="small" placeholder="请输入标记描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { interfaceCreateBadge } from '@/api/tagboxApi/tagboxApi';
import { badgeImage } from '@/utils/documentEnum';
export default {
  name: 'createNewBadge',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 构件ID
    buildId: {
      type: Number
    },
    // 传进来的构件ID的位置信息
    pos: {
      type: Array
    },
    // 传进来的视口信息
    viewport: {
      type: String
    },
    count: {
      type: Number
    }
  },
  data() {
    return {
      badgeImageUrl: '/badge/red.png',
      isBadgeImageVisible: false,
      badgeImage: badgeImage,
      createBadgeForm: {
        companyId: localStorage.getItem('companyId'),
        type: 'red',
        name: '',
        location: '',
        description: '',
        buildId: '',
        projectId: localStorage.getItem('projectId'),
        viewport: '',
        // 参与人员
        partInUser: ''
      },
      badgeType: [
        {
          value: 'red',
          label: '安全问题',
          color: 'red'
        },
        {
          value: 'blue',
          label: '质量问题',
          color: 'blue'
        },
        {
          value: 'yellow',
          label: '工程问题',
          color: 'yellow'
        },
        {
          value: 'green',
          label: '其他问题',
          color: 'green'
        }
      ]
    };
  },
  methods: {
    // 更换标记图片
    changeBadge(val) {
      const menu = {
        red: '/badge/red.png',
        blue: '/badge/blue.png',
        yellow: '/badge/yellow.png',
        green: '/badge/green.png'
      };
      this.badgeImageUrl = menu[val];
    },
    handleConfirm() {
      console.log(this.pos);
      const _this = this;
      const href = window.location.origin;
      this.createBadgeForm.viewport = this.viewport;
      this.createBadgeForm.buildId = this.buildId;
      const data = {
        ...this.createBadgeForm
      };
      interfaceCreateBadge(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message);
          const infoArray = JSON.parse(window.sessionStorage.getItem('badgeArray')) || [];
          // eslint-disable-next-line no-unreachable
          const badgeName = 'anc' + this.count;
          const info = {
            ancname: badgeName, // 锚点的名称(唯一标识)
            pos: this.pos, // 锚点的位置
            picpath: href + _this.badgeImageUrl, // 锚点的纹理路径(要求32*32像素，png格式)
            textinfo: ''
          };
          infoArray.push(info);
          REaddAnchors(infoArray);
          this.$emit('add-count');
          window.sessionStorage.setItem('badgeArray', JSON.stringify(infoArray));
        } else {
          return this.$message.error(res.message);
        }
      }).finally(() => {
        this.handleCursorSetDefault();
        this.$emit('remove-event');
        this.$emit('close-modal');
      });
    },
    // 编辑重新选择
    edit() {
      this.handleCursorSetNew();
      this.$emit('close-modal');
    },
    handleCancel() {
      this.handleCursorSetDefault();
      this.$emit('remove-event');
      this.$emit('close-modal');
    },
    // 鼠标光标样式设置
    handleCursorSetDefault() {
      document.getElementsByTagName('canvas')[2].addEventListener('mousemove', e => {
        document.getElementsByTagName('canvas')[2].style.cursor = 'default';
      });
    },
    handleCursorSetNew() {
      document.getElementsByTagName('canvas')[2].addEventListener('mousemove', e => {
        document.getElementsByTagName('canvas')[2].style.cursor = 'crosshair';
      });
    }
  }
};
</script>

<style scoped lang="scss">
.g-box {
  /deep/ .el-dialog {
    z-index: 10
  }
  /deep/ .el-input-group__append {}
  .edit__build {
    cursor: pointer;
    margin-left: px2rem(20);
    color: $bluebor;
  }
}
</style>
