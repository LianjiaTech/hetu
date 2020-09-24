import dateformat from 'dateformat'
import log4js, { Configuration } from 'log4js'
import logPath from '~/src/config/log'
import path from 'path'
import _ from 'lodash'
import { AxiosResponse } from 'axios'
import emitter from '~/src/library/event'
import { Request, Response } from 'express'
import { getProjectCode } from '~/src/controller/proxy/_utils'

export interface Action {
  request: Request
  response: Response
}

type ILogType = 'access' | 'api' | 'application' | 'error'
type ILog4jsConfig = {
  [key in ILogType]: {
    filename: string
    type: string
    pattern: string
    alwaysIncludePattern: boolean
    keepFileExt?: boolean
    daysToKeep?: number
    layout?: {
      type: string
    }
    maxLogSize?: number
    ignore?: boolean | string[]
    formatter: Function
    loggingResponseBodyLimit?: number
  }
}

const logNames: ILog4jsConfig = {
  // access 页面请求日志
  access: {
    filename: 'access.log',
    type: 'dateFile',
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: false,
    ignore: false,
    loggingResponseBodyLimit: Infinity,
    formatter([type, request, content]: ['input' | 'output', Request, any]) {
      const makeContext = {
        input: () =>
          JSONStringify({
            query: request.query || {},
            body: request.body || {},
            // @ts-ignore
            formData: request.form,
          }),
        output: () => {
          return content
        },
      }

      return Object.assign(
        {
          // @ts-ignore
          cost: request._endTime_ ? request._endTime_ - request._startTime_ : 0,
          channel: 'request',
          method: request.method,
          // @ts-ignore
          ip: request._ip_,
          context: makeContext[type] ? makeContext[type]() : '',
          message: type,
          headers: request.headers,
        },
        commonLog(),
      )
    },
  },
  // api 后端接口请求日志
  api: {
    filename: 'api.log',
    type: 'dateFile',
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: false,
    formatter([request, axiosResponse]: [Request, AxiosResponse]) {
      const projectCode = getProjectCode(request.path)
      return Object.assign(
        {
          displayName: projectCode,
          // @ts-ignore
          api_url: axiosResponse.config.url,
          // @ts-ignore
          cost: request._endTime_ - request._startTime_,
          channel: 'api',
          http_code: axiosResponse.status,
          method: axiosResponse.config.method,
          requestHeaders: axiosResponse.config.headers,
          context: JSONStringify({
            query: axiosResponse.config.params,
            body: axiosResponse.config.data,
            // @ts-ignore
            form: axiosResponse.config.form || {},
          }),
          responseHeaders: axiosResponse.headers,
          response: axiosResponse.data,
          message: axiosResponse.status === 200 ? 'succeed' : 'failed',
        },
        commonLog(request),
      )
    },
  },
  // application 应用日志
  application: {
    filename: `application.log`,
    type: 'dateFile',
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: false,
    formatter({ message, trace }: { message: string; trace?: string }) {
      return Object.assign(
        {
          channel: 'application',
          message: message,
          context: trace,
        },
        commonLog(),
      )
    },
  },
  // error 错误日志
  error: {
    filename: `error.log`,
    type: 'dateFile',
    pattern: '-yyyy-MM-dd',
    keepFileExt: true,
    alwaysIncludePattern: false,
    formatter(error: Error) {
      return Object.assign(
        {
          channel: 'error',
          context: error.message + '\n' + error.stack,
          message: error.name,
        },
        commonLog(),
      )
    },
  },
}

const log4jsConfig: Configuration = {
  appenders: {
    stdout: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['stdout'], level: 'debug' },
  },
}

type IFormatters = {
  [key: string]: Function
}
const formatters: IFormatters = {}
const loggers: { [k: string]: log4js.Logger } = {}

for (let name in logNames) {
  if (Object.prototype.hasOwnProperty.call(logNames, name)) {
    const appender = Object.assign({}, logNames[name as ILogType])
    // 处理 filename
    appender.filename = path.join(logPath, appender.filename)
    appender.layout = { type: 'json' }
    appender.maxLogSize = 10485760 // 10M
    // 处理 formatter
    formatters[name] = appender.formatter.bind(appender)
    // 生成 log4jsConfig
    log4jsConfig.appenders[name] = appender
    log4jsConfig.categories[name] = { appenders: [name], level: 'info' }
  }
}

// 设置log4js
log4js.addLayout('json', (config) => (event) => JSONStringify(event.data[0]))
log4js.configure(log4jsConfig)

// 日志延迟队列
let cacheLogAccess: object[] = []
let cacheLogApi: object[] = []
let cacheLogApplication: object[] = []
let cacheLogError: object[] = []

for (let name in logNames) {
  loggers[name] = log4js.getLogger(name)
  const eventName = 'log.' + name
  const markEventName = eventName + '.mark'
  const logger = log4js.getLogger(name)
  const formatter = formatters[name]

  // 延迟写频率
  const throttle_log = _.throttle(function () {
    if (cacheLogAccess.length) {
      loggers['access'].info(cacheLogAccess)
      cacheLogAccess = []
    }
    if (cacheLogApi.length) {
      loggers['api'].info(cacheLogApi)
      cacheLogApi = []
    }
    if (cacheLogApplication.length) {
      loggers['application'].info(cacheLogApplication)
      cacheLogApplication = []
    }
    if (cacheLogError.length) {
      loggers['error'].info(cacheLogError)
      cacheLogError = []
    }
  }, 10)

  const mark = (type: string, message: any) => {
    if (!message) return
    // 频率内日志入延迟队列
    switch (type) {
      case 'log.access.mark':
        cacheLogAccess.push(message)
        break
      case 'log.api.mark':
        cacheLogApi.push(message)
        break
      case 'log.application.mark':
        cacheLogApplication.push(message)
        break
      case 'log.error.mark':
        cacheLogError.push(message)
        break
      default:
        // 非默认四种类型，直接写文件
        logger.info(message)
        break
    }
    throttle_log()
  }

  emitter.on(eventName, (args) => mark(markEventName, formatter(args)))
}

function commonLog(_request?: Request) {
  let request = _request

  const now = new Date()
  // @ts-ignore
  const action = global.__unstable__getContext && (global.__unstable__getContext() as Action)

  if (action) {
    request = action.request
  }

  return {
    process_id: process.pid,
    request_time: dateformat(now, 'yyyy-mm-dd HH:MM:ss'),
    // @ts-ignore
    request_id: request && request._ip_,
    // @ts-ignore
    user_id: request && request._ucid_,
    uri: request && request.path,
  }
}

/**
 * Circular reference JSON stringify
 * @param obj
 */
function JSONStringify(obj: object) {
  // Note: cache should not be re-used by repeated calls to JSON.stringify.
  let cache: string[] = []
  return JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return
      }
      // Store value in our collection
      cache.push(value)
    }
    return value
  })
}
