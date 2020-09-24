import { Request, Response, NextFunction } from 'express'
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers'
// @ts-ignore
import multipart from 'connect-multiparty'

const multipartMiddleware = multipart()

/**
 * 通用文件上传中间件
 */
@Middleware({ type: 'before' })
class multiFormMiddleware implements ExpressMiddlewareInterface {
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.path !== '/api/upload') {
      return multipartMiddleware(req, res, next)
    }
    next()
  }
}

export default multiFormMiddleware
