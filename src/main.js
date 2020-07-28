import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Element from 'element-ui';
import 'normalize.css/normalize.css'; // 所有浏览器 统一
import Router from 'vue-router';
import Header from './components/comModule/header';
import fabric from 'fabric';

Vue.config.productionTip = false;
Vue.use(Element);
Vue.use(fabric);
Vue.component('commonHead', Header);

const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
