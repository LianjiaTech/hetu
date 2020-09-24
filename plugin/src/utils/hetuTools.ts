import _, { get, isFunction, isPlainObject } from 'lodash'
import md5 from 'md5'
import React from 'react'
import * as ReactIs from 'react-is'
import { getComponent } from '~/components'
import { evalJavascript } from '.'
import { JsonSchema } from '../types'
import { customRequest } from './request'
import { isElementConfig } from './valid'

/**
 * 创建一个ReactNode节点
 *
 * @param { Object } elementConfig ReactNode配置
 * @param { Object } defaultProps 默认属性
 * @param { String } dataPageConfigPath 相对于PageConfig的路径, 例如 PageConfig = { elementConfig: { props: 'a' }}, 'a'相对于pagestate 的路径为 `elementConfig.props.a`
 * @returns { ReactNode } ReactNode节点, 具有data-pageconfig-path和pagestate属性
 *
 * @example const elementConfig = { type: "Button", props: {}, "children": ["提交"] }
 * @example const Node = createElement(elementConfig, {}, 'elementConfig.props.button')
 * @example // Node => <Button data-pageconfig-path="elementConfig.props.button" pagestate={pagestate}>提交</Button>
 */
// eslint-disable-next-line max-params
export function createElement(
  elementConfig: React.ReactText | JsonSchema.ElementConfig,
  defaultProps: JsonSchema.DynamicObject = {},
  dataPageConfigPath = '',
  pagestate: JsonSchema.Pagestate
): React.ReactNode {
  // 空字符串, null, undefined, 0, false
  if (!elementConfig) return elementConfig

  if (!isElementConfig(elementConfig)) {
    // string/number/boolean
    if (
      _.isString(elementConfig) ||
      _.isNumber(elementConfig) ||
      _.isBoolean(elementConfig)
    ) {
      return elementConfig
    }

    // ReactNode
    if (ReactIs.isElement(elementConfig)) {
      return elementConfig
    }

    // array/function/object
    throw new TypeError('element格式错误:' + JSON.stringify(elementConfig))
  }

  const {
    type,
    props = {},
    children = [],
  } = elementConfig as JsonSchema.ElementConfig

  const mergeProps = { ...props, ...defaultProps }

  if (_.has(mergeProps, 'v-if') && !mergeProps['v-if']) {
    return null
  }
  delete mergeProps['v-if']

  let _children: any
  if (_.isArray(children) && children.length) {
    _children = children.map((child, index) => {
      if (_.isPlainObject(child)) {
        return createElement(
          child,
          {},
          `${dataPageConfigPath}.children[${index}]`,
          pagestate
        )
      }
      return child
    })
  }
  const { Component } = getComponent(type)

  return React.createElement(
    Component,
    {
      ...mergeProps,
      key: dataPageConfigPath,
      // @ts-ignore
      'data-pageconfig-path': dataPageConfigPath,
      'data-component-type': type,
      pagestate: pagestate,
    },
    ..._children
  )
}

/**
 * json模版解析
 *
 * @param {*} v 要解析的模版
 * @param {*} pagestate 变量作用域
 * @param {*} varReg 匹配的正则表达式
 * @returns {pageConfig} 解析结果
 */
export const parseJsonTemplate = function(
  v: any,
  pagestate: JsonSchema.Pagestate
): any {
  try {
    if (_.isString(v)) {
      // [旧] 变量语法
      const varReg = /^\${(.*)}$/

      const matchs = v.match(varReg)

      if (_.isArray(matchs) && matchs[1]) {
        const match = matchs[1]
        return evalJavascript(match, pagestate)
      }

      // [新] lodash template 变量语法, 字符串类型
      const stringTemplateReg = /<%=(.*)%>/
      if (stringTemplateReg.test(v)) {
        return _.template(v)(pagestate)
      }

      // [新] lodash template 变量语法, 非字符串类型
      const notStringTemplateReg = /^\s*<%:=([\s\S]+?)%>\s*$/
      const matchs2 = v.match(notStringTemplateReg)
      if (_.isArray(matchs2) && matchs2[1]) {
        const match = matchs2[1]
        return evalJavascript(match, pagestate)
      }

      return v
    }

    if (ReactIs.isElement(v)) return v

    if (_.isPlainObject(v)) {
      // 如果包含'v-for属性', 并且是一个react element配置
      if (isElementConfig(v)) {
        return v
      }

      const formateV: JsonSchema.DynamicObject = {}
      for (let key in v) {
        if (Object.prototype.hasOwnProperty.call(v, key)) {
          formateV[key] = parseJsonTemplate(v[key], pagestate)
        }
      }

      return formateV
    }

    if (_.isArray(v)) {
      let result: any[] = []
      v.forEach(val => {
        let child = parseJsonTemplate(val, pagestate)
        result.push(child)
      })
      return result
    }

    // number, boolean
    return v
  } catch (e) {
    setTimeout(() => {
      throw e
    })
  }
}

/**
 * 将一个函数转化为一个promise
 *
 * @param {fn} 延迟执行的函数
 *
 */
export const createPromise = <T>(fn: Function): Promise<T> => {
  return new Promise((res, rej) => {
    if (!isFunction(fn)) {
      rej(
        new TypeError(
          'the first argument of getAsyncState must be an function, but got' +
            JSON.stringify(fn)
        )
      )
    }

    setTimeout(() => {
      try {
        let result = fn()
        res(result)
      } catch (e) {
        rej(e)
      }
    })
  })
}

export const resolveLocal = (
  local: JsonSchema.DynamicObject,
  pagestate: JsonSchema.Pagestate
) => {
  const _local = parseJsonTemplate(local, pagestate)
  return {
    ...pagestate,
    ..._local,
  }
}

export const resolveRemote = async (
  _remote: JsonSchema.Remote,
  pagestate: JsonSchema.Pagestate
) => {
  const remote = parseJsonTemplate(_remote, pagestate)

  if (!isPlainObject(remote)) {
    if (remote) {
      setTimeout(() => {
        throw new TypeError('dependencies must be an plain object')
      })
    }

    return pagestate
  }

  // promise实例数组
  const promissInstances: Promise<any>[] = []
  const responseData: JsonSchema.DynamicObject = {}

  Object.keys(remote).forEach(key => {
    const {
      url,
      transform,
      method = 'get',
      params,
      data,
      ...otherConfig
    } = remote[key]

    let _params = params
    let _data = data
    if (['post', 'patch', 'put'].indexOf(method) !== -1 && !data) {
      _data = params
    }

    // 没有加载过, 则重新请求数据
    promissInstances.push(
      new Promise((resolve, reject) => {
        customRequest(url, {
          ...otherConfig,
          params: _params,
          data: _data,
          method,
        })
          .then((res: any) => {
            const { data } = res

            responseData[key] = data

            if (isFunction(transform)) {
              responseData[key] = transform(data)
            }

            resolve()
          })
          .catch((err: Error) => reject(err))
      })
    )
  })

  await Promise.all(promissInstances)

  return Promise.resolve({ ...pagestate, ...responseData })
}

export function resolveHook(hook: string, pagestate: JsonSchema.Pagestate) {
  const fn = parseJsonTemplate(hook, pagestate)

  if (!_.isFunction(fn)) {
    return console.error(`${hook} must be a function`)
  }

  fn(pagestate)
}

/**
 * 解析dependiencies
 * @param {Object} _dependencies 待解析的数据依赖
 * @param {Object} pagestate 作用域
 * @returns { Promise<pagestate> } pagestate
 */
export async function resolveDependencies(
  _dependencies: JsonSchema.Dependencies,
  pagestate: JsonSchema.Pagestate
): Promise<JsonSchema.Pagestate> {
  const dependencies = parseJsonTemplate(_dependencies, pagestate)

  if (!isPlainObject(dependencies)) {
    if (dependencies) {
      setTimeout(() => {
        throw new TypeError('dependencies must be an plain object')
      })
    }

    return pagestate
  }

  // promise实例数组
  const promissInstances: Promise<any>[] = []
  const responseData: JsonSchema.DynamicObject = {}

  Object.keys(dependencies).forEach(key => {
    const type = get(dependencies, [key, 'type'])

    if (type === 'ajax') {
      const { config } = dependencies[key]
      const { url, transform, method = 'get', ...otherConfig } = config

      // 没有加载过, 则重新请求数据
      promissInstances.push(
        new Promise((resolve, reject) => {
          customRequest(url, { ...otherConfig, method })
            .then((res: any) => {
              const { data } = res

              responseData[key] = data

              if (isFunction(transform)) {
                responseData[key] = transform(data)
              }

              resolve()
            })
            .catch((err: Error) => reject(err))
        })
      )
      return
    }

    if (type === 'data') {
      const { value } = dependencies[key]
      responseData[key] = value
      return
    }

    responseData[key] = dependencies[key]
  })

  await Promise.all(promissInstances)
  return Promise.resolve({ ...pagestate, ...responseData })
}

/**
 * JSON.stringify 一个对象
 * @param o
 */
export function stringify(o?: object) {
  try {
    return JSON.stringify(o)
  } catch (e) {
    console.error(e.message)
    return ''
  }
}

export function generateHash(s: string) {
  return md5(s)
}

/**
 * 比较两个json对象是否相等
 * @param a
 * @param b
 */
export function isJsonObjectEqual(a: object, b: object) {
  return stringify(a) === stringify(b)
}
