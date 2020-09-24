import _, {
  isArray,
  isBoolean,
  isNumber,
  isPlainObject,
  isString,
  set,
} from 'lodash'
import React from 'react'
import { JsonSchema } from '../types'

export const componentAliasMap: JsonSchema.DynamicObject = {}
export const updateComponentAlias = (path: string, value: any) => {
  set(componentAliasMap, path, value)
}

/**
 * 根据label的值获取option的值
 * @param value
 * @param options
 * @param labelField
 * @param valueField
 */
// eslint-disable-next-line max-params
export function getLabelByValue(
  value: React.ReactText | boolean | any[],
  options: any,
  labelField = 'label',
  valueField = 'value'
) {
  if (isArray(options)) {
    if (isArray(value)) {
      // 多选的情况
      let result: any[] = []
      options.forEach(val => {
        if (isPlainObject(val)) {
          if (value.indexOf(val[valueField]) !== -1) {
            result.push(val[labelField])
          }
        }
      })
      if (result) {
        return result.join(',')
      }
    } else {
      let item = options.find(v => {
        if (isPlainObject(v)) {
          return v[valueField] === value
        }
        if (isString(v) || isNumber(v) || isBoolean(v)) {
          return v === value
        }
        return false
      })
      if (item) {
        return isPlainObject(item) ? item[labelField] : item
      }
    }
  }
  return value
}

/**
 * 深冻结函数
 *
 * @param obj
 */
export function deepFreeze(obj: JsonSchema.DynamicObject) {
  // 取回定义在obj上的属性名
  const propNames = Object.getOwnPropertyNames(obj)

  // 在冻结自身之前冻结属性
  propNames.forEach(function(name) {
    const prop = obj[name]

    // 如果prop是个对象，冻结它
    if (typeof prop === 'object' && prop !== null) deepFreeze(prop)
  })

  // 冻结自身(no-op if already frozen)
  return Object.freeze(obj)
}

/**
 * 获取原始的组件名
 * @param C 组件
 */
export const getPlainComponentName = (C: React.ReactElement) => {
  if (!React.isValidElement(C)) {
    throw new TypeError('参数错误:' + C)
  }

  // HetuBody 包裹的组件特殊处理
  if (_.isFunction(C.type) && _.get(C, 'type.name') === 'HetuBody') {
    return _.get(C, 'props.elementConfig.type')
  }

  let max = 10
  let path = 'type.WrappedComponent'

  while (_.get(C, path) && max > 0) {
    max--
    path += '.WrappedComponent'
  }

  return _.get(C, path.replace(/.WrappedComponent$/, '.displayName'))
}

/**
 * 将字符串当成js表达式执行
 *
 * @param {string} expression
 * @param {Object} scope
 */
export function evalJavascript(
  expression: string,
  scope: JsonSchema.DynamicObject
) {
  // TODO 过滤不安全的字符
  let evalFunction

  try {
    // eslint-disable-next-line no-new-func
    evalFunction = new Function('scope', `with(scope) { return ${expression} }`)
  } catch (e) {
    console.warn(`expression:${expression} is not valid`)
    return undefined
  }

  try {
    return evalFunction(scope)
  } catch (e) {
    try {
      return evalFunction(window)
    } catch (err) {
      console.warn(`expression:${expression} is not valid`)
    }
  }
}

/**
 * 从页面路径从获取项目唯一标识, 页面路径格式为 /project/${projectCode}/*
 * @param path
 * @returns
 */
export function getProjectFromPath(path: string) {
  let pathReg = /^\/project\/([^\/]*)\//

  const matchs = path.match(pathReg)

  if (Array.isArray(matchs)) {
    const projectCode = matchs[1]
    return projectCode
  }

  return undefined
}
