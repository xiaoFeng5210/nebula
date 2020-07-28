module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
    // 不需要引入无关的组件
    'vue/no-unused-components': 'off',
    // 注释风格要不要有空格什么的
    'space-comment': 0,
    // 语句强制分号结尾
    semi: [2, 'always'],
    // 大括号内是否允许不必要的空格
    'object-curly-spacing': [0, 'never'],
    // 函数名首行大写必须使用new方式调用，首行小写必须用不带new方式调用
    'new-cap': 2,
    // 对象字面量中冒号的前后空格
    'key-spacing': [0, {
      beforeColon: 'false',
      afterColon: 'true'
    }],
    'init-declarations': 0, // 声明时必须赋初值
    indent: [2, 2], // 缩进风格
    'default-case': 2, // switch语句最后必须有defaul
    'comma-style': [2, 'last'], // 逗号风格，换行时在行首还是行尾
    camelcase: 2, // 强制驼峰法命名
    'callback-return': 1, // 避免多次调用回调什么的
    'arrow-parens': 0, // 箭头函数用小括号括起来
    'no-warning-comments': [1, {
      terms: ['todo', 'fixme', 'xxx'],
      location: 'start'
    }], // 不能有警告备注
    'no-unused-vars': [2, {
      vars: 'all',
      args: 'after-used'
    }], // 不能有声明后未被使用的变量或参数
    'no-use-before-define': 2, // 未定义前不能使用
    'no-unneeded-ternary': 2, // 禁止不必要的嵌套 var isYes = answer === 1 ? true : false;
    // 'no-unreachable': 2, // 不能有无法执行的代码
    'no-unused-expressions': 2, // 禁止无用的表达式
    'no-undef': 1, // 不能有未定义的变量
    'no-undef-init': 2, // 变量初始化时不能直接给它赋值为undefined
    'no-undefined': 2 // 不能使用undefined
  }
};
