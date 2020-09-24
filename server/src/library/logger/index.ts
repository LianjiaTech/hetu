import _ from 'lodash'
import emitter from '~/src/library/event'
import util from 'util'
import { Request, Response } from 'express'
import { AxiosResponse } from 'axios'
import './config'

interface Action {
  request: Request
  response: Response
}

// 封装全局方法给业务用
const console_log = console.log.bind(console)
console.log = function logger(data, ...args) {
  const message = util.format(data, ...args)
  // 获取调用 log 的地方
  const obj: any = {}
  Error.captureStackTrace(obj, logger)
  const trace = obj.stack.replace(obj.toString(), '')
  emitter.emit('log.application', { message, trace })
  // ! log信息不上报hobber监控
  return console_log(data, ...args)
}

const console_error = console.error.bind(console)
console.error = function logger(data, ...args) {
  const message = util.format(data, ...args)
  // 获取调用 error 的地方
  const error = new Error(message)
  Error.captureStackTrace(error, logger)
  emitter.emit('log.error', error)
  // * 上报至hobber监控
  emitter.emit('log.watcher', { error, type: 'common_log', level: 'error' })
  return console_error(data, ...args)
}

function Logger(type: 'log.watcher', message: any): void
function Logger(type: 'log.access', message: ['input', Action]): void
function Logger(type: 'log.access', message: ['output', Action, any]): void
function Logger(type: 'log.api', message: [Request, AxiosResponse]): void
function Logger(type: 'log.application', message: { message: string; trace?: string }): void
function Logger(type: 'log.error', message: Error): void
function Logger(type: string, message: any): void {
  emitter.emit(type, message)
}

export default Logger
