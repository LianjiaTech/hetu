import React from 'react'
import _ from 'lodash'
import { DvaInstance } from 'dva'

/**
 * 格式化路径
 * @example formatUrl('//aaa//bbb///') => /aaa/bbb/;
 * @example formatUrl('/aaa') => /aaa/;
 * @example formatUrl('aaa') => /aaa/;
 * @example formatUrl('aaa/') => /aaa/;
 */
export function formatUrl(pathname: string): string {
  let lastChar = '/'
  return Object.values(pathname + '/').reduce((acc, cur) => {
    if (lastChar === '/' && cur === '/') {
      return acc
    }
    lastChar = cur
    return acc + cur
  }, lastChar)
}

export function evalJavascript(expression: string, scope: any) {
  // TODO 过滤不安全的字符
  try {
    const evalFunction = new Function('scope', `with(scope) { return ${expression} }`)
    return evalFunction(scope)
  } catch (e) {
    e.message = e.message + 'expression:' + expression
    throw e
  }
}

const modelNotExisted = (app: DvaInstance, model: string) =>
  // @ts-ignore
  !app._models.some(({ namespace }) => {
    // @ts-ignore
    return namespace === model.substring(model.lastIndexOf('/') + 1)
  })

// 动态注册model
export function addModel(app: DvaInstance, models: string[]) {
  models.forEach((modelName) => {
    if (modelNotExisted(app, modelName)) {
      app.model(require(`../models/${modelName}`).default)
    }
  })
}

export const changeIframePageConfig = (v: dynamicObject) => {
  return new Promise((resolve, reject) => {
    let _n = 0
    let _timeout: any = null
    const _changeIframePageConfig = (pageConfig: dynamicObject) => {
      if (_.isFunction(window.$$changeIframePageConfig)) {
        window.$$changeIframePageConfig(pageConfig).then(resolve).catch(reject)
      } else {
        if (_n > 200) {
          clearTimeout(_timeout)
          reject()
          console.error('_changeIframePageConfig 失败')
          return false
        }
        _n = _n ? _n + 1 : 1
        _timeout = setTimeout(() => {
          _changeIframePageConfig(pageConfig)
        }, 150)
      }
    }

    _changeIframePageConfig(v)
  })
}

// 获取slot组件
export const getSlotComponent = (slotName: string, children: any) => {
  const isOK = (child: any) => _.get(child, 'props.slot') === slotName
  return React.Children.toArray(children).filter((child) => isOK(child))
}

/**
 * 是否为saas环境
 *
 * @returns { Boolean } true: 是; false: 否
 */
export const isSaas = () => {
  let reg = /dtsaas/
  return reg.test(window.navigator.userAgent)
}

/**
 * 检查页面配置是旧版河图页面配置还是新版配置
 * Gui编辑器只支持新版组件, 因此需要在编辑器启动时判断页面所属类型, 以启动对应编辑器
 * @param {Object} pageConfig
 */
export function isOldPageConfig(pageConfig: dynamicObject) {
  let jsonPageConfig = ''
  try {
    jsonPageConfig = JSON.stringify(pageConfig)
  } catch (e) {}
  if (
    // 只有识别到这个属性, 则认为是可视化编辑器
    jsonPageConfig.includes('"type":"HtGuiContainer')
  ) {
    // 这两个组件是新加的, 新编辑器只为这两个组件对应的页面设计, 因此可以通过这两个组件判断是不是新页面
    return false
  }
  return true
}
