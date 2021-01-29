// PostCSS plugins
const postcss = require('rollup-plugin-postcss')
const resolve = require('rollup-plugin-node-resolve')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const pkg = require('./package.json')
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.less', '.css']
const path = require('path')
const fs = require('fs')

function myRollupPlugin() {
  return {
    name: 'rollup-plugin-output-manifest-myself',
    generateBundle: async (options, bundle) => {
      const targetDir = path.resolve(__dirname, `dist`)
      const filePath = `${targetDir}/manifest.json`
      const manifest = {
        files: {
          'index.js': `/${pkg.version}/hetu.umd.development.js`,
          'index.min.js': `/${pkg.version}/hetu.umd.production.min.js`,
          'index.css': `/${pkg.version}/index.css`,
        },
        entrypoints: ['index.js', 'index.css']
      }

      try {
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        await fs.promises.writeFile(filePath, JSON.stringify(manifest, null, 2));
      } catch (e) {
        throw e;
      }
    }
  }
}

module.exports = {
  rollup(config, options) {

    config.plugins.push(
      postcss({
        plugins: [
          autoprefixer(),
          cssnano({
            preset: 'default',
          }),
        ],
        inject: false,
        // only write out CSS for the first bundle (avoids pointless extra files):
        extract: options.format === 'umd' ? `./dist/${pkg.version}/index.css` : './lib/index.css',
        extensions: ['.less', '.css'],
      }),
      resolve({ extensions }),
      options.format === 'umd' && myRollupPlugin()
    )

    if (options.format === 'esm') {
      // 输出路径加上版本号
      config.output.file = config.output.file.replace(path.resolve(__dirname, './dist'), path.resolve(__dirname, './lib'))
    }

    if (options.format === 'umd') {
      // https://www.rollupjs.com/guide/big-list-of-options/#%E6%A0%B8%E5%BF%83%E5%8A%9F%E8%83%BDcore-functionality
      config.output.globals = {
        'react': 'React',
        'react-dom': 'ReactDom',
        'react-is': 'ReactIs',
        'mobx': 'Mobx',
        'mobx-react': 'MobxReact',
        'mobx-react-lite': 'MobxReactLite',
        '@ice/stark-data': '@ice/stark-data',
        'axios': 'Axios',
        'antd': 'Antd',
        'antd/lib/locale/zh_CN': 'AntdZhCN',
        'lodash-es': '_',
        'js-cookie': 'Cookie',
        'mitt': 'Mitt',
        'path-to-regexp': 'PathToRegexp',
        'query-string': 'QueryString',
        'moment': 'Moment',
        'md5': 'Md5',
        'monaco-editor': 'MonacoEditor',
        'react-monaco-editor': 'ReactMonacoEditor',
        'bizcharts': 'Bizcharts',
        '@antv/data-set': 'AntvDataSet'
      }

      // 输出路径加上版本号
      config.output.file = config.output.file.replace(path.resolve(__dirname,'./dist'), path.resolve(__dirname, './dist/'+pkg.version))

      // https://www.rollupjs.com/guide/tools/#peer-dependencies
      config.external = Object.keys(config.output.globals)
    }

    return config
  },
}
