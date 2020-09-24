const path = require('path')
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default
const replaceLib = require('antd-tools/lib/replaceLib')
const _ = require('lodash')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'

function alertBabelConfig(rules) {
  rules.forEach(rule => {
    if (rule.loader && rule.loader === 'babel-loader') {
      if (rule.options.plugins.indexOf(replaceLib) === -1) {
        rule.options.plugins.push(replaceLib)
      }
      // eslint-disable-next-line
      rule.options.plugins = rule.options.plugins.filter(
        plugin =>
          !plugin.indexOf ||
          plugin.indexOf('babel-plugin-add-module-exports') === -1
      )
      // Add babel-plugin-add-react-displayname
      rule.options.plugins.push(
        require.resolve('babel-plugin-add-react-displayname')
      )
    } else if (_.isFunction(rule.test) && rule.test('index.less')) {
      // less-loader
      rule.use.push({
        loader: require.resolve('less-loader'),
        options: {
          sourceMap: true,
          modifyVars: {
            // 修改antd样式前缀为ht
            'ant-prefix': 'ht',
            // or
            // 'hack': `true; @import "your-less-file-path.less";`, // Override with less file
          },
          javascriptEnabled: true,
        }
      })
    } else if (rule.use) {
      alertBabelConfig(rule.use)
    }
  })
}

module.exports = {
  port: 8001,
  hash: true,
  source: {
    components: './components',
    docs: './docs',
    changelog: [],
  },
  output: isDev ? './_site' : '../_site',
  theme: './theme',
  htmlTemplate: './template.html',
  themeConfig: {
    categoryOrder: {
      介绍: 0,
      // 使用场景: 2,
      // 接口规范: 4,
      接入必看: 2,
      详细教程: 10,
      // 项目管理: 10,
      // 页面管理: 20,
      快速上手: 40,
      // 底层概念: 60,
      隐藏黑科技: 60,
      高级用法: 80,
      // FAQ: 100,
      Components: 200,
      关于河图: 300,
    },
    typeOrder: {
      业务组件: 0,
      布局: 1,
      'Field 表单项': 3,
      图表: 4,
      通用: 6,
      导航: 10,
      反馈: 16,
      数据展示: 18,
      其他: 20,
    },
    docVersions: {},
  },
  filePathMapper(filePath) {
    if (filePath === '/index.html') {
      return ['/index.html', '/index-cn.html']
    }
    return filePath
  },
  doraConfig: {
    verbose: true,
  },
  lessConfig: {
    javascriptEnabled: true,
  },
  webpackConfig(config) {
    // eslint-disable-next-line
    config.resolve.alias = {
      '~': path.join(__dirname, '../src'),
      '@': path.join(__dirname, './'),
      'react-router': 'react-router/umd/ReactRouter',
      'hetu': path.resolve(__dirname, `../lib/hetu.esm.js`),
      'hetu.css': path.resolve(__dirname, `../lib/index.css`),
    }

    config.optimization = {
      minimizer: [],
    }

    if (isDev) {
      // eslint-disable-next-line
      config.devtool = 'source-map'
    }

    alertBabelConfig(config.module.rules)

    config.plugins.push(
      new CSSSplitWebpackPlugin({
        size: 4000,
      }),
    )

    if (!isDev) {
      config.plugins.push(new MonacoWebpackPlugin({
        // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        languages: ['json']
      }))
    }

    return config
  },

  devServerConfig: {
    public: process.env.DEV_HOST || 'localhost',
    disableHostCheck: !!process.env.DEV_HOST,
  },

  htmlTemplateExtraData: {
    isDev,
    usePreact: false,
  },
}
