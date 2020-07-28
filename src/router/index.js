import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/index';

Vue.use(VueRouter);

// 文件过多时  主文件路由s
// const importComponents = process.env.NODE_ENV === 'development' ? file => require('@/views/' + file + '.vue').default : file => import('@/views/' + file + '.vue');

const routes = [{
  path: '/',
  redirect: {
    name: 'index'
  }
},
{
  path: '/invite',
  name: 'invite',
  // component: importComponents('index'),
  component: () => import('@/views/invitePage.vue'),
  meta: {
    title: '邀请'
  }
}, {
  path: '/login',
  name: 'index',
  // component: importComponents('index'),
  component: () => import('@/views/index.vue'),
  meta: {
    title: '登录'
  }
},
{
  path: '/invitePage',
  name: 'invitePage',
  // component: importComponents('index'),
  component: () => import('@/views/invitePage.vue'),
  meta: {
    title: '邀请'
  }
},
{
  path: '/agreement',
  name: 'agreement',
  component: () => import('@/components/logins/agreement.vue'),
  meta: {
    title: '登录'
  }
},
{
  path: '/coming',
  name: 'coming',
  component: () => import('@/views/peel/coming.vue'),
  meta: {
    title: '欢迎您'
  }
},
{
  path: '/registered',
  name: 'registered',
  component: () => import('@/views/peel/registered.vue'),
  meta: {
    title: '注册成功'
  }
},
{
  path: '/fees',
  name: 'fees',
  component: () => import('@/views/setting/fees.vue'),
  meta: {
    title: '收费标准'
  }
},
{
  path: '/newtopic',
  name: 'newtopic',
  component: () => import('@/views/peel/newtopic.vue'),
  meta: {
    title: '创建项目'
  }
},
{
  path: '/selfCenter',
  name: 'selfCenter',
  redirect: '/information',
  component: () => import('@/views/selfCenter.vue'),
  meta: {
    title: '个人中心'
  },
  children: [{
    path: '/information',
    name: 'information',
    component: () => import('@/components/selfCenter/information.vue'),
    meta: {
      title: '账户信息'
    }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/components/selfCenter/project.vue'),
    meta: {
      title: '我的项目'
    }
  }]
}, {
  path: '/projectlist',
  name: 'projectlist',
  component: () => import('@/views/projectlist.vue'),
  meta: {
    title: '首页'
  }
},
{
  path: '/projectSetting',
  name: 'projectSetting',
  redirect: '/personSet',
  component: () => import('@/views/projectSetting.vue'),
  meta: {
    title: '设置'
  },
  children: [{
    path: '/personSet',
    name: 'personSet',
    component: () => import('@/components/projectCenter/personSet.vue'),
    meta: {
      title: '项目人员'
    }
  }, {
    path: '/projectSets',
    name: 'projectSets',
    component: () => import('@/components/projectCenter/projectSets.vue'),
    meta: {
      title: '人员审核'
    }
  }, {
    path: '/baseinfo',
    name: 'baseinfo',
    component: () => import('@/components/projectCenter/baseinfo.vue'),
    meta: {
      title: '基础信息'
    }
  },
  {
    path: '/configset',
    name: 'configset',
    component: () => import('@/components/projectCenter/configset.vue'),
    meta: {
      title: '配置设置'
    }
  },
  {
    path: '/logmanage',
    name: 'logmanage',
    component: () => import('@/components/projectCenter/logmanage.vue'),
    meta: {
      title: '日志管理'
    }
  },
  // {
  //   path: '/rolepermission',
  //   name: 'rolepermission',
  //   component: () => import('@/components/projectCenter/rolepermission.vue'),
  //   meta: {
  //     title: '角色权限'
  //   }
  // },
  {
    path: '/datamanage',
    name: 'datamanage',
    component: () => import('@/components/projectCenter/datamanage.vue'),
    meta: {
      title: '资料管理'
    }
  },
  {
    path: '/datamanage',
    name: 'datamanage',
    component: () => import('@/components/projectCenter/datamanage.vue'),
    meta: {
      title: '资料管理'
    }
  }]
},
{
  path: '/controller',
  name: 'controller',
  redirect: '/complete',
  component: () => import('@/views/controller.vue'),
  meta: {
    title: '资料'
  },
  children: [{
    path: '/complete',
    name: 'complete',
    component: () => import('@/components/controle/complete.vue'),
    meta: {
      title: '全部列表'
    }
  }, {
    path: '/collect',
    name: 'collect',
    component: () => import('@/components/controle/collect.vue'),
    meta: {
      title: '个人收藏'
    }
  }, {
    path: '/recycle',
    name: 'recycle',
    component: () => import('@/components/controle/recycle.vue'),
    meta: {
      title: '回收站'
    }
  }]
}, {
  path: '/tableMain',
  name: 'tableMain',
  component: () => import('@/views/tableMain.vue'),
  meta: {
    title: '工作台'
  }
},
{
  path: '/tablePage',
  name: 'tablePage',
  redirect: '/backlog',
  component: () => import('@/views/tablePage.vue'),
  meta: {
    title: '待办事项'
  },
  children: [{
    path: '/backlog',
    name: 'backlog',
    component: () => import('@/components/workTable/backlog.vue'),
    meta: {
      title: '待办事项'
    }
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('@/components/workTable/news.vue'),
    meta: {
      title: '最新动态'
    }
  },
  {
    path: '/notice',
    name: 'notice',
    component: () => import('@/components/workTable/notice.vue'),
    meta: {
      title: '通知公告'
    }
  },
  {
    path: '/noticeDetail',
    name: 'noticeDetail',
    component: () => import('@/components/workTable/noticeDetail.vue'),
    meta: {
      title: '公告详情'
    }
  }
  ]
}, {
  path: '/progress',
  name: 'progress',
  component: () => import('@/views/progress.vue'),
  meta: {
    title: '转换中心'
  }
},
{
  path: '/mainScene',
  name: 'mainScene',
  redirect: '/scene',
  component: () => import('@/views/mainScene.vue'),
  meta: {
    title: '场景'
  },
  children: [{
    path: '/scene',
    name: 'scene',
    component: () => import('@/components/scene/panorama.vue'),
    meta: {
      title: '场景'
    }
  },
  {
    path: '/resource',
    name: 'resource',
    component: () => import('@/components/scene/resource.vue'),
    meta: {
      title: '资源管理'
    }
  },
  {
    path: '/uploadManage',
    name: 'uploadManage',
    component: () => import('@/components/scene/uploadManage.vue'),
    meta: {
      title: '上传管理'
    }
  },
  {
    path: '/menuTree',
    name: 'menuTree',
    component: () => import('@/components/scene/menuTree.vue'),
    meta: {
      title: '目录树管理'
    }
  }
  ]
},
{
  path: '/firmManage',
  name: 'firmManage',
  redirect: '/roleManage',
  component: () => import('@/views/firmManage.vue'),
  meta: {
    title: '企业管理'
  },
  children: [{
    path: '/roleManage',
    name: 'roleManage',
    component: () => import('@/components/firmManage/roleManage.vue'),
    meta: {
      title: '角色管理'
    }
  },
  {
    path: '/comboManage',
    name: 'comboManage',
    component: () => import('@/components/firmManage/comboManage.vue'),
    meta: {
      title: '套餐管理'
    }
  },
  {
    path: '/memberManage',
    name: 'memberManage',
    component: () => import('@/components/firmManage/memberManage.vue'),
    meta: {
      title: '人员管理'
    }
  },
  {
    path: '/organization',
    name: 'organization',
    component: () => import('@/components/firmManage/organization.vue'),
    meta: {
      title: '组织管理'
    }
  },
  {
    path: '/downloadCenter',
    name: 'downloadCenter',
    component: () => import('@/components/downloadCenter/downloadCenter.vue'),
    meta: {
      title: '下载中心'
    }
  }]
}

];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  // 如果没登录,都导向登录页
  if (!store.getters.token && to.path !== '/agreement' && to.path !== '/invite') {
    if (to.path !== '/login') {
      return next({ path: '/login' });
    } else {
      return next();
    }
  } else if (to.meta.title) {
    /* 路由发生变化修改页面title */
    document.title = to.meta.title;
    return next();
  }
});
/**
 * 跳转登陆页面强制刷新，相当于F5
 */
router.afterEach((to, from) => {
  if (from.path !== '/login' && from.path !== '/' && to.path === '/login') {
    window.location.reload();
  }
});

export default router;
