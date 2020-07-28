const path = require('path');

const mockIndexData = require('./mock/index.json'); // mock 数据

const IS_PROD = ['production', 'test'].includes(process.env.NODE_ENV);

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  filenameHashing: false,
  lintOnSave: true,
  devServer: {
    // open: true,//自动打开浏览器
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    // 使用mock 拦截
    before: app => {
      app.post('/api/abc', (req, res) => {
        res.json(mockIndexData.abc);
      });
    },
    /* 使用代理 */
    proxy: {
      '/api': {
        // target: 'http://192.168.1.165:9802/',
        target: 'http://192.168.1.8:18051/',
        // target: 'http://192.168.1.84:8761/',
        changeOrigin: true,
        secure: false, // 如果是https接口，需要配置这个参数
        pathRewrite: {
          '^/api': ''
        }
      },
      '/tianqi': {
        target: 'https://api.map.baidu.com/location/ip?ak=wVg1oglV4BDE2DHW1EBSNuPrtfHZ4hXD&coor=bd09ll',
        changeOrigin: true,
        secure: false, // 如果是https接口，需要配置这个参数
        pathRewrite: {
          '^/tianqi': ''
        }
      },
      '/enginupload': {
        target: 'http://192.168.1.179:17000/autoconvertnew/',
        changeOrigin: true,
        secure: false, // 如果是https接口，需要配置这个参数
        pathRewrite: {
          '^/enginupload': ''
        }
      }
    }
  },
  // webpack 配置
  chainWebpack: (config) => {
    // 链式配置
    config.resolve.symlinks(true);
    config.resolve.alias.set('styles', resolve('src/assets/styles')).set('@', resolve('src'));
  },
  // css相关配置
  css: {
    requireModuleExtension: false,
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/common.scss";' // scss 文件地址
      }
    }
  }
  // 第三方插件
  // pluginOptions: {
  //   dll: {
  //     entry: ['vue', 'vue-router', 'element-ui', 'js-cookie', 'axios'],
  //     cacheFilePath: path.resolve(__dirname, './public')
  //   }
  // }
};
