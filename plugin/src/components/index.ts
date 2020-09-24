import _ from 'lodash'
import * as ReactIs from 'react-is'
import { JsonSchema } from '~/types'
// 通用
import HtButton from './Button'
// 业务组件
import HtCard from './Card'
// 容器
import HtGuiContainer from './Container'
import HtDivider from './Divider'
import { addField } from './Field/components'
import HtForm from './Form'
import HtList from './List'
import HtModalForm from './ModalForm'
// 其他
import HtTable from './Table'
import HtTabs from './Tabs'
import HtBChart from './BChart'
import HtException from './Exception'

export let componentMap = {
  HtGuiContainer,
  HtDivider,
  HtListContainer: HtGuiContainer,
  HtFormContainer: HtGuiContainer,
  HtModalForm,
  HtButton,
  HtCard,
  HtTabs,
  HtBChart,
  HtForm,
  HtList,
  HtTable,
  HtException,
}

window.$$componentMap = componentMap

function checkValid(componentName: string, Component: any) {
  // @ts-ignore
  if (_.get(componentMap, componentName) !== undefined) {
    console.warn(
      `组件 ${componentName} 已存在, 请修改组件名.已有组件名${Object.keys(
        componentMap
      )}`
    )
    return false
  }

  if (!ReactIs.isValidElementType(Component)) {
    console.warn(`组件 ${componentName} 不符合组件规范`)
    return false
  }
  return true
}

export type ComponentType = keyof typeof componentMap

export function addComponent(componentName: string, Component: any) {
  if (checkValid(componentName, Component)) {
    // @ts-ignore
    _.set(componentMap, componentName, Component)
    return true
  }
  return false
}

/**
 * 注册自定义组件
 *w
 * @param map 组件map, 例如 { Button: Button }
 * @param prefix 组件名前缀, 例如 'Antd', 默认 ''
 */
export function use(map: JsonSchema.DynamicObject, prefix = '') {
  for (let key in map) {
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      const ComponentName = `${prefix}${key}`
      let type = _.get(map, [key, '__belong__'])

      const C = _.get(map, [key])

      switch (type) {
        case 'HtField':
          addField(ComponentName, C)
          break
        default:
          addComponent(ComponentName, C)
      }
    }
  }
}

/**
 * 获取组件、组件类型
 *
 * @param { string } type 组件名
 * @returns { {Component: string | React.Component, type: "Ht" | "h5" } } { component, type }
 */
export function getComponent(
  type: string
): {
  Component: string | React.ComponentClass | React.FunctionComponent
  type: 'Ht' | 'h5'
} {
  if (_.get(componentMap, type)) {
    return { Component: _.get(componentMap, type), type: 'Ht' }
  }

  return { Component: type, type: 'h5' }
}
