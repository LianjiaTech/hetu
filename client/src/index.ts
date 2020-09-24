import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'url-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import dva from 'dva'
import createLoading from 'dva-loading'
import { initGlobalResource } from '~/utils'
import { addModel } from '~/utils/utils'
import { store } from '@ice/stark-data'
import Home from '~/routes/Home'

// 引入less文件才能, 替换less变量
import 'antd/dist/antd.less'
import 'antd/lib/input/style/index.css'
import 'antd/lib/button/style/index.css'
import 'antd/lib/message/style/index.css'
import 'antd/lib/modal/style/index.css'
import 'antd/lib/notification/style/index.css'
import './index.less'

import _history from './utils/history'

// JsonEditor 组件配置
window.$$PUBLIC_URL = window.location.protocol + process.env.PUBLIC_URL

initGlobalResource()

function createApp(history = _history) {
  // 1. Initialize
  const app = dva({
    history,
    onError: (e) => {
      // 当页面发生错误时, 为了不阻塞进程, 同时将错误抛出
      setTimeout(() => {
        throw e
      })
    },
  })

  // 2. Plugins
  app.use(createLoading())

  // 3. Register moduels
  addModel(app, ['global', 'guiEditor'])

  // 4. Router
  app.router(require('./router').default)

  // 5. Start
  const App = app.start()

  return App
}

function renderApp(props: any) {
  const { ucid, projectCode, requestConfig, pageconfigsMap, history } = props
  store.set('hetu-ucid', ucid)
  store.set('hetu-project-code', projectCode)
  store.set('hetu-request-config', requestConfig)
  store.set('hetu-pageconfigs-map', pageconfigsMap)
  ReactDOM.render(React.createElement(Home, { history }), document.getElementById('hetu-root'))
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: any) {
  renderApp(props)
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props: any) {
  ReactDOM.unmountComponentAtNode(document.getElementById('hetu-root'))
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props: any) {
  renderApp(props)
}

if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  // @ts-ignore
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
} else {
  const App = createApp()
  ReactDOM.render(React.createElement(App, {}), document.getElementById('hetu-editor-root'))
}
