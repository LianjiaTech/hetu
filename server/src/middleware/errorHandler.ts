import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers'
import { Request, Response } from 'express'
import Logger from '~/src/library/logger'

@Middleware({ type: 'after' })
class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response, next: (err?: any) => any) {
    if (response.finished === false) {
      // websocket 的页面路径过滤
      if (['/__hetu_log__', '/__log__', '/socket.io'].includes(request.path)) {
        if (error.name === 'NotFoundError') {
          return next()
        }
      }

      error.message = `${request.protocol}://${request.hostname}${request.originalUrl} ${error.message}`
      Logger('log.error', error)
    }

    next()
  }
}

export default CustomErrorHandler
