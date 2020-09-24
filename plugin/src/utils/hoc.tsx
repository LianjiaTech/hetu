import _ from 'lodash'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import moment from 'moment'
import React from 'react'
import * as ReactIs from 'react-is'
import { getComponent } from '~/components'
import { JsonSchema } from '~/types'
import { parseJsonTemplate } from './hetuTools'
import { isElementConfig } from './valid'

export declare type IReactComponent<P = any> =
  | React.ClassicComponentClass<P>
  | React.ComponentClass<P>
  | React.FunctionComponent<P>
  | React.ForwardRefExoticComponent<P>

export function WithParsedProps<T extends IReactComponent>(C: T): T {
  class WrapperComponent extends React.Component<any, any> {
    render() {
      const {
        'data-pageconfig-path': dataPageconfigPath = '',
        'data-component-type': dataComponentType,
        children,
        pagestate,
        ...rest
      } = this.props
      const ele = parseJsonTemplate(rest, pagestate)

      if (_.has(ele, 'v-if') && !ele['v-if']) {
        return null
      }
      delete ele['v-if']

      const parsedProps = parseProps2(
        ele,
        `${dataPageconfigPath}.props`,
        pagestate
      )

      return (
        <C
          {...parsedProps}
          data-pageconfig-path={dataPageconfigPath}
          data-component-type={dataComponentType}
          pagestate={pagestate}
        >
          {children}
        </C>
      )
    }
  }

  return observer(WrapperComponent as T)
}

export function parseProps2(
  v: any,
  dataPageConfigPath: string,
  pagestate: JsonSchema.Pagestate
): any {
  try {
    if (ReactIs.isElement(v)) return v

    if (_.isPlainObject(v)) {
      // 如果为一个reactNode配置, 则渲染为一个ReactNode节点
      if (isElementConfig(v)) {
        return (
          <HetuBody
            key={dataPageConfigPath}
            elementConfig={v}
            defaultProps={{ key: v.props.key || dataPageConfigPath }}
            dataPageConfigPath={dataPageConfigPath}
            pagestate={pagestate}
          />
        )
      }

      let formatV: JsonSchema.DynamicObject = {}
      for (let key in v) {
        if (Object.prototype.hasOwnProperty.call(v, key)) {
          formatV[key] = parseProps2(
            v[key],
            `${dataPageConfigPath}.${key}`,
            pagestate
          )
        }
      }
      return formatV
    }

    if (_.isArray(v)) {
      return v.map((val: any, i: number) => {
        return parseProps2(val, `${dataPageConfigPath}[${i}]`, pagestate)
      })
    }

    return v
  } catch (e) {
    setTimeout(() => {
      throw e
    })
  }
}

interface IHetuBodyProps {
  elementConfig: React.ReactText | JsonSchema.ElementConfig
  defaultProps: JsonSchema.DynamicObject
  dataPageConfigPath: string
  pagestate: JsonSchema.Pagestate
}

let map = new Map()

@observer
export class HetuBody extends React.Component<IHetuBodyProps> {
  @computed get ele() {
    const { elementConfig, pagestate } = this.props
    return parseJsonTemplate(elementConfig, pagestate)
  }

  render() {
    const {
      elementConfig: _ele,
      defaultProps,
      dataPageConfigPath,
      pagestate,
      ...otherProps
    } = this.props

    let elementConfig = this.ele
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

    const mergeProps = { ...props, ...defaultProps, ...otherProps }

    let _children: any
    if (_.isArray(children) && children.length) {
      _children = children.map((child, index) => {
        if (_.isPlainObject(child)) {
          return (
            <HetuBody
              key={`${dataPageConfigPath}.children[${index}]`}
              elementConfig={child}
              defaultProps={{}}
              dataPageConfigPath={`${dataPageConfigPath}.children[${index}]`}
              pagestate={pagestate}
            />
          )
        }

        if (_.isString(child)) {
          return parseJsonTemplate(child, pagestate)
        }

        return child
      })
    }
    const { Component } = getComponent(type)

    if (process.env.NODE_ENV !== 'test') {
      console.log(
        `[${moment().format('HH:mm:ss')}] 渲染组件${type}`,
        mergeProps
      )
    }

    let C = Component
    if (!_.isString(Component)) {
      if (!map.get(Component)) {
        // 为了避免getComponent循环依赖, 在这里调用高阶组件WithParsedProps
        // 保证WithParsedProps(Component)只执行一次, 将WithParsedProps(Component)缓存起来
        map.set(Component, WithParsedProps(Component))
      }
      C = map.get(Component)
    }

    return React.createElement(
      C,
      {
        ...mergeProps,
        key: dataPageConfigPath,
        // @ts-ignore
        'data-pageconfig-path': dataPageConfigPath,
        'data-component-type': type,
        pagestate: pagestate,
      },
      _children
    )
  }
}
