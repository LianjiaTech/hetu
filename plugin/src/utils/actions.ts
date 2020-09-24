import { message, Modal, notification } from 'antd'
import _, { isFunction, isPlainObject } from 'lodash'
import { JsonSchema } from '../types/index'
import { emitter } from './events'
import { customRequest } from './request'

// action 处理(旧版)
export const resolveAction = (type: string) => {
  // 返回上一页
  if (type === 'goBack') {
    window.history.go(-1)
  }

  // 刷新页面
  if (type === 'reload') {
    window.location.reload()
  }

  // 重定向
  let redirectToReg = /^redirectTo:([\w.\/:]+)$/
  let pathReg = /^(https?:\/)?\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
  if (redirectToReg.test(type)) {
    let match = type.match(redirectToReg) || []
    let target = match[1]

    if (!pathReg.test(target)) {
      return console.error(`${target} 路径不合法,页面无法跳转`)
    }

    window.location.href = target
  }

  // 触发事件
  let triggerReg = /^trigger:([\w.]+)$/
  if (triggerReg.test(type)) {
    let match = type.match(triggerReg) || []
    let target = match[1]
    emitter.emit(target)
  }
}

export type actionType =
  | 'goBack'
  | 'reload'
  | 'redirectTo'
  | 'trigger'
  | 'request'
  | 'openWindow'
  | 'message'
  | 'modal'
  | 'notification'

export type _onSuccessActionConfig = [actionType, any] | null

// action 处理(新版)
// eslint-disable-next-line complexity
export const _resolveAction = (
  type: actionType,
  config?: any,
  pagestate?: JsonSchema.Pagestate
) => {
  let fullPathReg = /^(https?:\/)\//

  // 在iframe中
  if (window.$$child) {
    let parentOrigin = window.$$child.parentOrigin

    // 如果在iframe中
    switch (type) {
      case 'goBack':
        return window.$$child.emit('parent.history', ['back'])
      case 'redirectTo':
        if (_.isString(config)) {
          if (config.indexOf(parentOrigin) !== -1) {
            // 如果路径包含父级页面源, 使用parent.history
            let redirectToURL = config.replace(parentOrigin, '')
            return window.$$child.emit('parent.history', [
              'push',
              redirectToURL,
            ])
          } else if (fullPathReg.test(config)) {
            // 如果非父级页面路径, 但是是全路径跳转
            return window.$$child.emit('parent.window', [
              'location.href',
              config,
            ])
          } else {
            if (pagestate && pagestate.history && !fullPathReg.test(config)) {
              return pagestate.history.push(config)
            }

            window.location.href = config
            return
          }
        }
        return console.error(`redirectTo error: ${JSON.stringify(config)}`)
      case 'reload':
        return window.$$child.emit('parent.window', ['location.reload'])
      case 'openWindow': // 打开新窗口
        if (_.isString(config)) {
          const winName = config
          return window.$$child.emit('parent.window', ['open', config, winName])
        }
        return console.error('openWindow error:', config)
      case 'message': // 信息提示
        return window.$$child.emit('parent.message', config)
      case 'modal': // 弹框确认
        return window.$$child.emit('parent.modal', config)
      case 'notification': // 信息提示
        return window.$$child.emit('parent.notification', config)
    }
  }

  switch (type) {
    case 'goBack':
      return pagestate && pagestate.history.goBack()
    case 'reload':
      return window.location.reload()
    case 'redirectTo':
      if (_.isString(config)) {
        // history && 相对路径
        if (pagestate && pagestate.history && !fullPathReg.test(config)) {
          return pagestate.history.push(config)
        }

        window.location.href = config
        return
      }
      console.error(`redirectTo error: ${JSON.stringify(config)}`)
      return
    case 'openWindow': // 打开新窗口
      if (_.isString(config)) {
        return window.open(config, config)
      }
      return console.error(`openWindow: ${config} is not valid`)
    case 'trigger': // 触发事件
      if (Array.isArray(config)) {
        return emitter.emit(config[0], config[1])
      }
      return emitter.emit(config)
    case 'request': // 发送ajax请求
      return pagestate && resolveActionRequest(config, pagestate)
    case 'message': // 信息提示
      // @ts-ignore
      return message(config)
    case 'modal': // 弹框确认
      // TODO 这里有bug
      // @ts-ignore
      return Modal(config)
    case 'notification': // 信息提示
      // @ts-ignore
      return notification(config)
  }
}

export interface ResolveActionRequestConfig {
  alias: string
  url: string
  method?: JsonSchema.Method
  params?: JsonSchema.DynamicObject
  data?: JsonSchema.DynamicObject
  transform?: (v: any) => any
}

export const resolveActionRequest = async (
  config: ResolveActionRequestConfig,
  pagestate: JsonSchema.Pagestate
) => {
  const { _S } = pagestate

  if (!isPlainObject(config)) {
    throw new Error('action request config is not a plain object')
  }
  if (!isFunction(_S)) {
    throw new Error(`_S must be a function`)
  }

  const {
    alias,
    url,
    method = 'get',
    params,
    data,
    transform,
    ...otherConfig
  } = config

  let _params = params
  let _data = data
  if (['post', 'patch', 'put'].indexOf(method) !== -1 && !data) {
    _data = params
  }

  return customRequest(url, {
    ...otherConfig,
    params: _params,
    data: _data,
    method,
  })
    .then(async (res: any) => {
      let data = res.data

      if (isFunction(transform)) {
        data = transform(data)
      }

      await _S(alias, data)

      return data
    })
    .catch(console.error)
}
