require('module-alias').addAlias('~/src', __dirname + '/')

import 'reflect-metadata' // this shim is required
import { useExpressServer } from 'routing-controllers'
import express from 'express'
import { NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import path from 'path'
import _ from 'lodash'
import ejs from 'ejs'
import moment from 'moment'

import appConfig from '~/src/config/app'
import env from '~/src/config/env'

import Logger from '~/src/library/logger'
import NetworkUtil from '~/src/library/utils/modules/network'

import ControllerList from '~/src/controller/index'

import ProxyMiddleware from '~/src/middleware/proxy'
import MultiFormMiddleware from '~/src/middleware/multi-form'
import { ContextMiddleware } from '~/src/middleware/context'
import CustomErrorHandler from '~/src/middleware/errorHandler'

import { createSocket } from './socket'

let server
const startup = () => {
  // 需要先创建express实例, 注册完中间层之后再将路由交给routing-controllers
  // 否则后续的中间层代码都拿不到cookie/body, 导致程序异常
  const app = express()
  // 设置body-parser
  app.use(bodyParser.urlencoded({ extended: false }))
  // 解析json请求
  app.use(bodyParser.json())
  // 设置cookie-parse
  app.use(cookieParser())

  // 设置存放模板引擎目录
  app.set('views', path.join(__dirname, './public'))
  // 设置模板引擎为ejs
  app.set('view engine', 'ejs')
  app.engine('html', ejs.renderFile)
  // app.set('view engine', 'html')

  app.use('/hetu-cdn', express.static(path.join(__dirname, 'hetu-cdn')))
  /* 添加静态路径 */
  app.use('/public', express.static(path.join(__dirname, 'public')))
  app.use('/favicon.ico', express.static(path.resolve(__dirname, './public/favicon.ico')))

  /**
   * 添加 /pubCheck 接口,供发布系统检测使用
   * 请求的优先级为最高, 且不需要登陆
   */
  let serverStartAtYmdHis = moment().format('YYYY-MM-DD HH:mm:ss')
  console.log(`服务启动于=>${serverStartAtYmdHis}`)
  app.use('/pubCheck', async (request: express.Request, response: express.Response, next: NextFunction) => {
    response.send({
      serverStartTime: serverStartAtYmdHis, // 系统启动时间
    })
    return
  })
  useExpressServer(app, {
    // 支持跨域
    cors: {
      origin: function (origin: any, callback: any) {
        callback(null, origin)
      },
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: false,
      allowedHeaders: ['Origin', 'X-Requested-With', 'X-Custom-Session', 'X-Hetu-Token', 'Content-Type', 'Accept'],
    },
    controllers: ControllerList, // we specify controllers we want to use
    middlewares: [ContextMiddleware, MultiFormMiddleware, ProxyMiddleware, CustomErrorHandler],
    defaultErrorHandler: false,
  })

  app.use('*', (request: express.Request, response: express.Response, next: NextFunction) => {
    if (
      (request.method === 'GET' || request.method === 'HEAD') &&
      request.accepts('html') &&
      // 前端接口请求都会带这个字段, 可以通过该字段区分请求类型
      // 所有header都是小写
      request.headers['x-requested-with'] !== 'XMLHttpRequest' &&
      // 该response之前没有被处理过
      response.finished === false
    ) {
      let uri = path.resolve(__dirname, 'public/index.html')
      response.setHeader('access-control-allow-origin', '*')
      response.render(uri, {
        env: env,
      })
      return
    }
    next()
  })

  let ipList = NetworkUtil.getLocalIpList()
  ipList = ['127.0.0.1']
  server = app.listen(appConfig.port, function () {
    console.log(`${appConfig.name} listening on port ${appConfig.port}`)
    console.log(`↓↓↓↓↓点击任意链接打开调试界面↓↓↓↓↓`)
    console.log(``)
    for (let ip of ipList) {
      let uri = `http://${ip}:${appConfig.port}/api/hetu/groups`
      console.log(`${uri}`)
      console.log(``)
    }
  })

  createSocket(server)
}

// 启动服务
if (!server) {
  //启动服务
  startup()
}

process.on('uncaughtException', function (err) {
  // 端口已存在
  if (_.get(err, 'code') === 'EADDRINUSE') {
    err.message = `uncaughtException 端口[${appConfig.port}]已被占用 ${err.message}`
    Logger('log.error', err)
    return
  }

  err.message = `uncaughtException ${err.message}`
  Logger('log.error', err)
})

process.on('unhandledRejection', function (err) {
  if (err instanceof Error) {
    err.message = `unhandledRejection ${err.message}`
    Logger('log.error', err)
  } else {
    Logger('log.error', new Error(JSON.stringify(err)))
  }
})
