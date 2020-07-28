<template>
  <el-dialog title="消息管理" :visible.sync="newsDialog" :modal="false" width="70%">
    <el-tabs tab-position="left" v-model="message" @tab-click="tagChange">
      <el-tab-pane :label="`全部`" name="first">
        <template>
          <div class="mainBox">
            <div class="handle-box d-flex jc-end">
              <el-select v-model="value" placeholder="全部项目" @change="handleChange($event)">
                <el-option
                  v-for="item in projectOption"
                  :key="item.id"
                  :label="item.projectName"
                  :value="item.id"
                ></el-option>
              </el-select>
              <div style="margin-left:10px;margin-right:10px">
                <el-input
                  v-model="searchValue"
                  placeholder="请输入关键字搜索"
                  @keyup.enter.native="searchNews"
                >
                  <i slot="prefix" class="el-input__icon el-icon-search" @click="searchNews"></i>
                </el-input>
              </div>
              <div>
                <el-button type="primary" @click="readAll">全部已读</el-button>
                <el-button type="primary" @click="readClick">已读</el-button>
                <el-button @click="readDel">删除</el-button>
              </div>
            </div>
            <el-table
              :data="allNews"
              style="width: 100%"
              height="500"
              @selection-change="tableSelected"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column prop="type" label="消息类型"></el-table-column>
              <el-table-column prop="organization" label="组织"></el-table-column>
              <el-table-column prop="contentList" label="消息内容"></el-table-column>
              <el-table-column label="查看">
                <template>
                  <el-button type="text">查看</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="发送时间" sortable></el-table-column>
            </el-table>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane :label="`公告消息`" name="second">
        <template>
          <div class="mainBox">
            <div class="handle-box d-flex jc-end">
              <el-select v-model="value" placeholder="全部项目" @change="handleChange($event)">
                <el-option
                  v-for="item in projectOption"
                  :key="item.value"
                  :label="item.projectName"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div style="margin-left:10px;margin-right:10px">
                <el-input
                  v-model="searchValue"
                  placeholder="请输入关键字搜索"
                  @keyup.enter.native="searchNews"
                >
                  <i slot="prefix" class="el-input__icon el-icon-search" @click="searchNews"></i>
                </el-input>
              </div>
              <div>
                <el-button type="primary" @click="readAll">全部已读</el-button>
                <el-button type="primary" @click="readClick">已读</el-button>
                <el-button @click="readDel">删除</el-button>
              </div>
            </div>
            <el-table
              :data="messageData"
              style="width: 100%"
              height="500"
              @selection-change="tableSelected"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column prop="type" label="消息类型"></el-table-column>
              <el-table-column prop="organization" label="组织"></el-table-column>
              <el-table-column prop="contentList" label="消息内容"></el-table-column>
              <el-table-column label="查看">
                <template>
                  <el-button type="text">查看</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="发送时间" sortable></el-table-column>
            </el-table>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane :label="`待办消息`" name="third">
        <template>
          <div class="mainBox">
            <div class="handle-box d-flex jc-end">
              <el-select v-model="value" placeholder="全部项目" @change="handleChange($event)">
                <el-option
                  v-for="item in projectOption"
                  :key="item.value"
                  :label="item.projectName"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div style="margin-left:10px;margin-right:10px">
                <el-input
                  v-model="searchValue"
                  placeholder="请输入关键字搜索"
                  @keyup.enter.native="searchNews"
                >
                  <i slot="prefix" class="el-input__icon el-icon-search" @click="searchNews"></i>
                </el-input>
              </div>
              <div>
                <el-button type="primary" @click="readAll">全部已读</el-button>
                <el-button type="primary" @click="readClick">已读</el-button>
                <el-button @click="readDel">删除</el-button>
              </div>
            </div>
            <el-table :data="messageData" style="width: 100%" height="500">
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column prop="type" label="消息类型"></el-table-column>
              <el-table-column prop="organization" label="组织"></el-table-column>
              <el-table-column prop="contentList" label="消息内容"></el-table-column>
              <el-table-column label="查看">
                <template>
                  <el-button type="text">查看</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="发送时间" sortable></el-table-column>
            </el-table>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane :label="`系统消息`" name="fourth">
        <template>
          <div class="mainBox">
            <div class="handle-box d-flex jc-end">
              <div>
                <el-button type="primary" @click="readAll">全部已读</el-button>
                <el-button type="primary" @click="readClick">已读</el-button>
                <el-button @click="readDel">删除</el-button>
              </div>
            </div>
            <el-table :data="messageData" style="width: 100%" height="500">
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column prop="type" label="消息类型"></el-table-column>
              <el-table-column prop="organization" label="组织"></el-table-column>
              <el-table-column prop="contentList" label="消息内容"></el-table-column>
              <el-table-column label="查看">
                <template>
                  <el-button type="text">查看</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="发送时间" sortable></el-table-column>
            </el-table>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
export default {
  name: 'message',
  data() {
    return {
      tab: '',
      newsDialog: false,
      message: 'first',
      value: '', // 搜索选中的值
      searchValue: '',
      queryData: {
        page: 1, // 页码
        size: 10, // 每页大小
        place: 2, // 消息按钮
        projectId: localStorage.getItem('projectId'), // 项目id
        query: '',
        type: ''
      },
      allNews: [],
      // 公告消息
      noticeNews: [
        {
          type: '公告消息',
          organization: '系统',
          contentList: '公告内容',
          createTime: '2020-07-22 09:36:31'
        },
        {
          type: '公告消息',
          organization: '系统',
          contentList: '公告内容',
          createTime: '2020-07-22 09:36:31'
        }
      ],
      // 待办消息
      backlogNews: [
        {
          type: '待办消息',
          organization: '系统',
          contentList: '待办内容',
          createTime: '2020-07-22 09:36:31'
        },
        {
          type: '待办消息',
          organization: '系统',
          contentList: '待办内容',
          createTime: '2020-07-22 09:36:31'
        }
      ],
      // 系统消息
      systemNews: [
        {
          type: '系统消息',
          organization: '系统',
          contentList: '欢迎注册使用星云系统',
          createTime: '2020-06-22 09:36:31'
        }
      ]
    };
  },
  props: {
    newsData: Array,
    projectOption: Array,
    messageData: Array
  },
  mounted() {},
  methods: {
    tagChange(tab) {
      console.log(tab, 'tab');
      if (tab.label === '全部') {
        this.tab = 'first';
      } else if (tab.label === '待办消息') {
        this.tab = 'third';
        this.queryData.type = 1;
      } else if (tab.label === '公告消息') {
        this.tab = 'second';
        this.queryData.type = 2;
      } else if (tab.label === '系统消息') {
        this.tab = 'fourth';
        this.queryData.type = 4;
      }
      this.$emit('tab-change', { queryData: this.queryData, tab: this.tab });
    },
    openNewsVisible() {
      this.newsDialog = true;
    },
    // 切换项目
    handleChange(event) {
      if (this.tab === 'first') {
        console.log(event, '1');
      } else if (this.tab === 'second') {
        console.log(event, '2');
      } else if (this.tab === 'third') {
        console.log(event, '3');
      } else {
        console.log(event, '4');
      }
      this.$emit('handle-change', event);
    },
    // 关键字搜索
    searchNews() {
      this.$emit('search-news', this.searchValue);
    },
    // 全部已读
    readAll() {
      this.$emit('read-all');
    },
    // 已读
    readClick() {
      this.$emit('read-click');
    },
    // 删除
    readDel() {
      this.$emit('read-del');
    },
    // 表格选中当前行
    tableSelected(rows) {
      this.$emit('select-ids', rows);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dialog {
  .mainBox {
    border-top: 1px solid rgba(222, 222, 222, 1);
    margin-bottom: px2rem(20);
  }
}
</style>
