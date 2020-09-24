import { AxiosResponse } from 'axios'
import * as http from 'http'
import Socket from 'socket.io'
import { Request, Response } from 'express'
import emitter from '~/src/library/event'
import Logger from '~/src/library/logger'
import redisClient from '~/src/library/redis'
import { getProjectCode } from '~/src/controller/proxy/_utils'

interface Action {
  request: Request
  response: Response
}

export function createSocket(server: http.Server) {
  const serverConfig = {
    path: '/socket.io',
    cookie: false,
  }
  // const redisConfig = {}

  const io = Socket(serverConfig)
  // io.adapter(redisAdapter(redisConfig))
  io.attach(server, serverConfig)
  // 给业务用的
  const socket = io.of('/__log__')
  // 河图socket
  const socketHetu = io.of('/__hetu_log__')

  const socketEditor = io.of('/__editor_log__')

  const messageSenders = {
    access([type, action, content]: ['input' | 'output', Action, any]) {
      if (type === 'input') return

      const { request, response } = action
      const projectCode = getProjectCode(request.path)
      // @ts-ignore
      const _id_ = request._id_
      const socketData = {
        projectCode: projectCode,
        uuid: _id_,
        url: request.path,
        originalUrl: request.originalUrl,
        method: request.method,
        // @ts-ignore
        timeCost: request._endTime_ - request._startTime_,
        // @ts-ignore
        startTime: request._startTime_,
        // @ts-ignore
        user_id: request._ucid_,
        requestHeaders: request.headers,
        requestType: request.headers['content-type'],
        requestQuery: request.query,
        requestBody: request.body,
        // @ts-ignore
        requestForm: request.form,
        // @ts-ignore
        requestIP: request._ip_,
        responseStatus: response.statusCode,
        responseHeader: response.getHeaders(),
        responseType: response.getHeader('content-type'),
        responseBody: content,
      }
      socket.emit(`${projectCode}-access`, socketData)
      socketHetu.emit(`hetu-access`, socketData)
    },
    api([request, axiosResponse]: [Request, AxiosResponse]) {
      const projectCode = getProjectCode(request.path)

      // @ts-ignore
      const _id_ = request._id_
      const socketData = {
        projectCode: projectCode,
        displayName: projectCode,
        uuid: _id_,
        // @ts-ignore
        user_id: request._ucid_,
        uri: axiosResponse.config.url,
        // @ts-ignore
        timeCost: request._endTime_ - request._startTime_,
        // @ts-ignore
        startTime: request._startTime_,
        method: axiosResponse.config.method,
        requestHeaders: axiosResponse.config.headers,
        requestQuery: axiosResponse.config.params,
        requestBody: axiosResponse.config.data,
        // @ts-ignore
        requestForm: axiosResponse.config.form,
        status: axiosResponse.status,
        responseHeaders: axiosResponse.headers,
        response: axiosResponse.data,
      }
      socket.emit(`${projectCode}-api`, socketData)
      socketHetu.emit(`hetu-api`, socketData)
    },
    error(error: Error) {
      const message = error.toString()
      const socketData = {
        error: message,
        stack: error.stack ? error.stack.replace(error.message, '') : message,
      }

      // @ts-ignore
      const action = global.__unstable__getContext() as Action
      if (action) {
        const { request } = action
        const projectCode = getProjectCode(request.path)
        socket.emit(`${projectCode}-error`, socketData)
        socketData.error = `[${projectCode}] ${socketData.error}`
      }

      socketHetu.emit(`hetu-error`, socketData)
    },
    application({ message, trace }: any) {
      const socketData = { message, trace }

      // @ts-ignore
      const action = global.__unstable__getContext() as Action
      if (action) {
        const { request } = action
        const projectCode = getProjectCode(request.path)
        socket.emit(`${projectCode}-application`, socketData)
        socketData.message = `[${projectCode}] ${socketData.message}`
      }

      socketHetu.emit(`hetu-application`, socketData)
    },
  }

  socket.on('connect_error', (error: Error) => {
    // @ts-ignore
    const action = global.__unstable__getContext() as Action
    if (action) {
      const { request } = action
      const projectCode = getProjectCode(request.path)
      error.message = `${projectCode} error.message`
    }

    Logger('log.error', error)
    // 触发河图socket
    socketHetu.emit('hetu-application', { message: error.message, trace: error.stack })
  })

  socketHetu.on('connect_error', (error: Error) => {
    Logger('log.error', error)
  })

  socketEditor.on('connection', (socket) => {
    socket.on('editor.heartbeat', async ({ pageId, account }: any) => {
      // 查询redis
      const currentAccount = (await redisClient.get(pageId)) as string
      // 当前账户仍在修改 或 没人修改
      if (account === currentAccount || !currentAccount) {
        // 写入新的redis
        redisClient.set(pageId, account, 'EX', 10)
      }
      // 返回lock状态及信息
      socket.emit('editor.lock', { currentPagId: pageId, currentAccount })
    })
  })

  socketEditor.on('connect_error', (error: Error) => {
    Logger('log.error', error)
  })

  emitter.on<any>('log.application', messageSenders.application)
  emitter.on<any>('log.api', messageSenders.api)
  emitter.on<any>('log.access', messageSenders.access)
  emitter.on<any>('log.error', messageSenders.error)
}
