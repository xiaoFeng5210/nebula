import { login, signIn, logout } from '@/api/user';
import { httpGetUserInfo } from '@/api/selfCenter/self';
import router from '@/router';
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth';
import {
  Message
} from 'element-ui';

const getDefaultState = () => {
  return {
    token: getToken('token')
  };
};

const state = {
  token: getToken('token'),
  phone: '',
  code: '',
  fullscreen: 3,
  errorMsg: ''
};

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_CODE: (state, code) => {
    state.code = code;
  },
  TOOGLE_SCREEN: (state, num) => {
    state.fullscreen = num;
  }
};

const actions = {
  // user login
  login({
    commit
  }, data) {
    commit('SET_CODE', '1');
    login(data).then(res => {
      if (res.code === 200) {
        commit('SET_TOKEN', res.data.access_token);
        setToken('token', res.data.access_token, res.data.expires_in);
        setToken('refresh_token', res.data.refresh_token, res.data.expires_in);
        httpGetUserInfo({ token: res.data.access_token }).then(res => {
          if (res.code === 200) {
            window.sessionStorage.setItem('userInfo', JSON.stringify(res.data));
            localStorage.getItem('projectId', res.data.defaultProjectId);
            localStorage.getItem('companyId', res.data.defaultCompanyId);
            if (res.data.defaultProjectId) {
              router.push({
                path: '/tableMain',
                query: {
                  id: res.data.defaultProjectId,
                  companyId: res.data.defaultCompanyId
                }
              });
            } else if (res.data.defaultCompanyId) {
              router.push({ path: '/projectlist' });
            } else {
              router.push({ path: '/coming' });
            }
          }
        });
      } else {
        commit('SET_CODE', res.code);
      }
    }).catch(() => {
      Message({
        message: '系统繁忙，请稍后重试！',
        type: 'error',
        duration: 5 * 1000
      });
    });
  },

  signIn({
    commit
  }, data) {
    signIn(data.datas).then(res => {
      if (res.code === 200) {
        Message({
          message: '注册成功',
          type: 'success'
        });
        // 调用登录接口获取token
        login({
          type: 1,
          userName: data.datas.userName,
          passWord: data.datas.passWord
        }).then((res) => {
          if (res.code === 200) {
            commit('SET_TOKEN', res.data.access_token);
            setToken('token', res.data.access_token, res.data.expires_in);
            setToken('refresh_token', res.data.refresh_token, res.data.expires_in);
            router.push({ path: '/coming' });
          }
        });
      }
    }).catch(error => {
      commit('SET_ERRORMSG', error);
    });
  },

  logout({ commit }, data) {
    logout(data).then(res => {
      if (res.code === 200) {
        commit('SET_TOKEN', '');
        removeToken('token');
        removeToken('refresh_token');
        router.replace({ path: '/' });
      }
    });
  },

  // remove token
  resetToken({
    commit
  }) {
    removeToken(); // must remove  token  first
    commit('RESET_STATE');
  },

  toogle({
    commit
  }, data) {
    commit('TOOGLE_SCREEN', data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
