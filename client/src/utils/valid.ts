import { isString, isArray, isPlainObject } from 'lodash'

/**
 * 验证是否为一个组件配置
 * @param {any} v
 * @returns {Boolean}
 */
export function isElementConfig(v: any): boolean {
  if (v === null) return true

  if (!isPlainObject(v)) return false

  const { type, props } = v

  if (isString(type) && isPlainObject(props)) {
    return true
  }
}

export function isPageConfig(v: any): boolean {
  if (!isPlainObject(v)) return false

  const { elementConfig } = v
  if (!isElementConfig(elementConfig)) return false

  return true
}
