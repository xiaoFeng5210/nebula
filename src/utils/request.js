import axios from 'axios';
import {
  Message
} from 'element-ui';
import store from '@/store/index';
import { getToken } from '@/utils/auth';
import qs from 'qs';

// create an axios instance
const service = axios.create({
  // baseURL: '', // url = base url + request url
  timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    const interceptUrl = config.url.substring(config.url.length - 5, config.url.length);
    // do something before request is sent
    if (interceptUrl === 'token') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
      config.data = qs.stringify(config.data);
    }
    if (store.getters.token && interceptUrl !== 'ister' && interceptUrl !== 'ndSms') {
      // let each request carry token
      config.headers.Authorization = 'Bearer ' + getToken('token');
    }
    // config.headers.Authorization = 'Bearer' + '9ba2b0c-18ae-40df-8b52-eb0149668e10';
    return config;
  },
  error => {
    console.log(error); // for debug
    return error;
  }
);

// response interceptor
service.interceptors.response.use(
  /**
 * If you want to get http information such as headers or status
 * Please return  response => response
 */
  response => {
    if (response.data.code !== 200 && response.data.code !== 301 && response.data.code !== 302 && !response.data.access_token && response.config.url !== 'tianqi/' && !response.data.savePath) {
      Message({
        message: response.data.message,
        type: 'error',
        duration: 3 * 1000
      });
      const errorRes = response.data;
      return errorRes;
    } else {
      const res = response.data;
      return res;
    }
  },
  () => {
    Message({
      message: '系统繁忙，请稍后重试！',
      type: 'error',
      duration: 5 * 1000
    });

    // return Promise.reject(error.response.data);
  }
);

export default service;
