import _ from 'lodash'
import Axios from 'axios'
import { selectedComponentData, ContainerData } from '~/types/models/guiEditor'
import * as antdComponents from 'antd'
import store from 'store'

const { message, notification, ..._antdComponents } = antdComponents

/**
 * 是否为javascript特殊语法
 * @param v
 * @example isJavascriptStr("${ 123 }") === true
 */
export function isJavascriptStr(v: any) {
  let reg = /^\${(.*)}$/
  return reg.test(v)
}

/**
 * 是否为javascript特殊语法, 在JSON编辑器中粘贴到Input输入框, 会带过来"\"两个双引号
 * @param v
 * @example isJavascriptStr("\"${ 123 }\"") === true
 */
export function isJavascriptStr2(v: any) {
  let reg = /^\"\${(.*)}\"$/
  return reg.test(v)
}

export async function initSubmodules(submodules: string) {
  if (_.isString(submodules)) {
    let _submodules = submodules.split(',')
    for (let submodule of _submodules) {
      submodule && (await initCDNResource(submodule))
    }

    let use = getHetu('use')
    if (!_.isFunction(use)) {
      throw new Error(`河图插件注入失败`)
    }
    // 注册antd组件
    use(_antdComponents, '')
  }
}

function getResouceType(url: string) {
  let jsReg = /\.js$/
  let cssReg = /\.css$/
  if (jsReg.test(url)) return 'javascript'

  if (cssReg.test(url)) return 'css'

  return undefined
}

function loadJS(url: string, submodule: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.setAttribute('hetustark', 'dynamic')
    script.setAttribute('submodule', submodule)
    script.type = 'text/javascript'
    script.crossOrigin = 'anonymous'
    script.src = url
    script.async = true
    script.onload = function () {
      resolve()
    }
    script.onerror = function () {
      reject()
    }

    document.head.appendChild(script)
  })
}

function loadCSS(url: string, submodule: string) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.setAttribute('hetustark', 'dynamic')
    link.setAttribute('submodule', submodule)
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = url
    link.onload = function () {
      resolve()
    }
    link.onerror = function () {
      reject()
    }
    document.head.appendChild(link)
  })
}

/**
 * 动态加载cdn资源
 * @param data
 */
export async function initCDNResource(submodule: string) {
  let publicPath = `${window.location.protocol}${process.env.CDN_URL}/${submodule}`

  if (store.get('hetu-cdn-public')) {
    publicPath = store.get('hetu-cdn-public')
  }

  if (process.env.NODE_ENV === 'development') {
    publicPath = `http://127.0.0.1:8080`
  }

  publicPath.replace('//', '/')

  // 获取manifest.json
  let manifestJson = await parseResourceUrl(`${publicPath}/manifest.json`)

  // 入口文件
  const entrypoints = _.get(manifestJson, ['data', 'entrypoints'])
  // 文件map
  const files = _.get(manifestJson, ['data', 'files'])

  if (!_.isArray(entrypoints)) {
    throw new Error(`组件库${submodule}加载失败`)
  }

  let promises = []

  for (let item of entrypoints) {
    let file = _.get(files, item)
    let resourceURL = `${publicPath}/${file}`

    let type = getResouceType(resourceURL)
    switch (type) {
      case 'javascript':
        promises.push(loadJS(resourceURL, submodule))
        break
      case 'css':
        promises.push(loadCSS(resourceURL, submodule))
        break
      default:
        continue
    }
  }

  await Promise.all(promises)

  // 卸载资源
  uninstallCDNResource(submodule)

  return true
}

/**
 * 卸载资源
 * @param url
 */
export async function uninstallCDNResource(submodule: string) {
  const nodes: NodeListOf<HTMLElement> = document.querySelectorAll(
    `script[hetustark='dynamic'],link[hetustark='dynamic']`,
  )
  for (let v of Array.from(nodes)) {
    if (v.getAttribute('submodule') !== submodule) {
      let parent = v.parentElement
      parent.removeChild(v)
    }
  }
}

export async function parseResourceUrl(url: string) {
  return await Axios({
    url,
    params: {
      time: new Date().getTime(),
    },
  })
}

export function initGlobalResource() {
  // 将外部依赖挂载到window上
  Object.assign(window, {
    React: require('react'),
    ReactDom: require('react-dom'),
    ReactIs: require('react-is'),
    Mobx: require('mobx'),
    MobxReact: require('mobx-react'),
    MobxReactLite: require('mobx-react-lite'),
    '@ice/stark-data': require('@ice/stark-data'),
    Axios: require('axios'),
    Antd: require('antd'),
    AntdZhCN: require('antd/lib/locale/zh_CN'),
    _: require('lodash-es'),
    Cookie: require('js-cookie'),
    Mitt: require('mitt'),
    PathToRegexp: require('path-to-regexp'),
    QueryString: require('query-string'),
    Moment: require('moment'),
    Md5: require('md5'),
    MonacoEditor: require('monaco-editor'),
    ReactMonacoEditor: require('react-monaco-editor'),
    Bizcharts: require('bizcharts'),
    AntvDataSet: require('@antv/data-set'),
  })
}

export function getWebType() {
  // 当前页面的父级页面类型, 可选值有iframe、编辑器、未知
  let parentType
  try {
    parentType = window.self !== window.top ? 'iframe' : undefined

    if (window.parent.$$isEditor) {
      parentType = 'editor'
    }
  } catch (e) {}

  return parentType
}

export function isContainerTypeValid(type: string) {
  let allowContainers = getHetu('allowContainers', [])
  return allowContainers.indexOf(type) !== -1
}

/**
 * 从选中的组件中, 获取当前的容器类型
 */
export function getContainerFromSelectedComponent(pageConfig: any, data: selectedComponentData) {
  if (_.isPlainObject(data)) {
    // 从当前选中的组件中获取容器
    const { dataComponentType, dataPageConfigPath } = data
    if (isContainerTypeValid(dataComponentType)) {
      return {
        type: dataComponentType,
        path: dataPageConfigPath,
      }
    }

    // 从父级路径获取
    let targetStr = '.props'
    let propsReg = new RegExp('.props', 'g')

    let results = []
    while (propsReg.exec(dataPageConfigPath) != null) {
      results.unshift(propsReg.lastIndex - targetStr.length)
    }

    for (let item of results) {
      let parentPath = dataPageConfigPath.slice(0, item)
      let parentType = _.get(pageConfig, `${parentPath}.type`)
      const isValidComponentType = getHetu('isValidComponentType')
      if (isValidComponentType(parentType)) {
        return {
          type: parentType,
          path: parentPath,
        }
      }
    }
  }

  // 获取默认容器类型
  const elementConfig = _.get(pageConfig, 'elementConfig')
  const result = getContainerFromElementConfig(elementConfig, 'elementConfig')
  if (result === false) {
    console.error(
      `页面没有检测到可编辑容器, 可添加容器为 ${JSON.stringify(getHetu('allowContainers', []))}`,
    )
    return false
  }
  return result
}

export /**
 * 获取GUI容器信息
 * @param elementConfig
 * @param path
 */
function getContainerFromElementConfig(elementConfig: any, path: string): ContainerData | false {
  if (!_.isPlainObject(elementConfig)) return false

  if (isContainerTypeValid(elementConfig.type)) {
    return {
      type: elementConfig.type,
      path,
    }
  }

  let children = elementConfig.children
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      let result = getContainerFromElementConfig(children[i] as any, `${path}.children[${i}]`)
      if (result && isContainerTypeValid(result.type)) return result
    }
  }

  return false
}

export function getContainerData(pageConfig: any, data?: selectedComponentData) {
  const elementConfig = _.get(pageConfig, 'elementConfig')

  if (!elementConfig) return false

  const result = getContainerFromSelectedComponent(pageConfig, data)

  if (result === false) {
    console.error(
      `页面没有检测到可编辑容器, 可添加容器为 ${JSON.stringify(getHetu('allowContainers', []))}`,
    )
    return false
  }

  return result
}

export function sleep(time: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
    setTimeout(() => {
      reject()
    }, 5000)
  })
}

export function getHetu(path: string[] | string, defaultValue?: any) {
  return _.get(window.Hetu, path, defaultValue)
}
