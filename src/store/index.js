import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import user from './modules/user';
import projectName from './modules/projectName';
import prolist from './modules/prolist';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    projectName,
    prolist
  },
  getters
});

export default store;
