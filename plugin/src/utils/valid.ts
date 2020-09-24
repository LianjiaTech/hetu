import _, { isPlainObject, isString } from 'lodash'

/**
 * 验证是否为一个组件配置
 * @param {any} v
 * @returns {Boolean} true: 是; false: 否
 */
export function isElementConfig(v: any): boolean {
  if (v === null) return true

  if (!isPlainObject(v)) return false

  const { type, props, __noRender = false } = v

  if (__noRender) {
    return false
  }

  if (isString(type) && isPlainObject(props)) {
    return true
  }

  return false
}

export function checkEditorConfigValid(config: any) {
  if (!_.isPlainObject(config)) return false
  const { selectedButtons, additableProperties, guiProperties } = config
  if (selectedButtons && !_.isArray(selectedButtons)) return false
  if (additableProperties && !_.isPlainObject(additableProperties)) return false

  if (!guiProperties) return false

  if (
    guiProperties &&
    !_.isPlainObject(guiProperties) &&
    !_.isFunction(guiProperties)
  )
    return false

  return true
}
