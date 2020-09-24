import _ from 'lodash'
import Express, { Request, Response } from 'express'
import { ExpressMiddlewareInterface } from 'routing-controllers'
import MLogin from '~/src/model/login'

// via Express路由最佳实践
class asyncCheckLoginMiddleware implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: Express.NextFunction) {
    // 使用session服务
    let isLogin = await MLogin.checkIsLogin(request)
    if (isLogin === false) {
      MLogin.apiLoginFailed(request, response)
      console.log('api loginFailed, auto redirect')
      return
    }
    next()
  }
}

export default asyncCheckLoginMiddleware
