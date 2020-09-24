import { message } from 'antd'
import { ArgsProps, ConfigOptions } from 'antd/es/message'
import _ from 'lodash'
declare type NoticeType =
  | 'info'
  | 'success'
  | 'error'
  | 'warning'
  | 'warn'
  | 'loading'
declare type ConfigContent = React.ReactNode | string
declare type ConfigDuration = number | (() => void)

export function createType(type: NoticeType) {
  return (content: ConfigContent, duration?: ConfigDuration) => {
    let fn = _.get(message, type)
    if (!_.isFunction(fn)) {
      throw new Error(`type:${type} is not exist`)
    }

    // 判断 parent.message 事件是否存在
    let events: any = []

    try {
      // 获取跨域iframe的对象, 会出现跨域错误
      events = _.get(window.$$child, 'parent.$$parent.events', {})
    } catch (e) {
      console.warn(`跨域错误, 不能获取父级iframe的对象`)
    }

    if (window.$$child && events['parent.message'] !== undefined) {
      // 在iframe中
      window.$$child.emit('parent.message', [type, content])
      return
    }

    return fn(content, duration)
  }
}

const Message = {
  success: createType('success'),
  error: createType('error'),
  info: createType('info'),
  warning: createType('warning'),
  warn: createType('warn'),
  loading: createType('loading'),
  open(config: ArgsProps) {
    return message.open(config)
  },
  config(options: ConfigOptions) {
    return message.config(options)
  },
  destroy() {
    return message.destroy()
  },
}

export default Message
