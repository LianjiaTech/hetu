import { Request, Response, NextFunction } from 'express'
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers'
import { Interceptor, InterceptorInterface, Action } from 'routing-controllers'
import Logger from '~/src/library/logger'
import _ from 'lodash'

import { contextMap, asyncIdMap, executionAsyncId } from '~/src/model/global'

/**
 * 通用接口转发中间件
 */
@Middleware({ type: 'before' })
export class ContextMiddleware implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: NextFunction) {
    const ctxSymbol = Symbol()
    contextMap.set(ctxSymbol, { request, response })
    const asyncId = executionAsyncId()
    if (asyncId !== null) asyncIdMap.set(asyncId, ctxSymbol)
    // @ts-ignore
    request._ctxSymbol_ = ctxSymbol
    // @ts-ignore
    request._startTime_ = Date.now()
    // @ts-ignore
    request._id_ = request.headers['x-req-id'] || _.uniqueId()

    Logger('log.access', ['input', { request, response }])

    next()
  }
}

@Interceptor()
export class LogInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any) {
    const { request, response } = action
    // @ts-ignore
    request._content_ = content

    return content
  }
}
