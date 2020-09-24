import { Request, Response, NextFunction } from 'express'
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers'
import { getValueFromRedis } from '~/src/controller/proxy/_utils'
import BaseProxyController from '~/src/controller/proxy/base_proxy_controller'
import Knex from '~/src/library/mysql'
import _ from 'lodash'
import Logger from '~/src/library/logger'
import { contextMap } from '~/src/model/global'

/**
 * 通用接口转发中间件
 */
@Middleware({ type: 'after' })
class asyncProxyMiddleware implements ExpressMiddlewareInterface {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const _ctxSymbol_ = req._ctxSymbol_

      // @ts-ignore
      req._endTime_ = Date.now()

      if (res.finished) {
        // 如果已经处理过了, 则跳过

        // @ts-ignore
        const content = req._content_

        Logger('log.access', ['output', { request: req, response: res }, content])

        if (_ctxSymbol_) {
          contextMap.delete(_ctxSymbol_)
        }
        return next()
      }

      let match = req.path.split('/')
      if (!_.isArray(match) || !_.isString(match[1])) {
        // match[1] 不存在
        return next()
      }
      let projectCode = match[1]

      const proxyHost = await this.getProxyHost(projectCode)

      if (!proxyHost) {
        // 对应的项目不存在, 则跳过
        return next()
      }

      let instance = new BaseProxyController()

      const responseData = await instance.request(req, res)

      Logger('log.access', ['output', { request: req, response: res }, responseData])
      if (_ctxSymbol_) {
        contextMap.delete(_ctxSymbol_)
      }

      res.send(responseData)
    } catch (e) {
      res.send({
        code: 500,
        message: e.message,
      })
    }
  }

  /**
   * 获取第三方请求的完整路径(域名+路径)
   * @param projectCode
   */
  async getProxyHost(projectCode: string): Promise<false | string> {
    let proxyHost = await getValueFromRedis([projectCode, 'proxy_domin'])
    if (!proxyHost) {
      // 如果本地不存在, 则从数据库获取
      const project = await Knex('project_new').select('*').where('project_code', projectCode).first()
      if (!_.get(project, 'id')) {
        // 对应的项目不存在
        return false
      }
      proxyHost = project.proxy_domin

      if (!proxyHost) {
        throw new Error(`项目 ${projectCode} 域名配置不存在, 请先设置接口域名`)
      }
    }

    return proxyHost
  }
}

export default asyncProxyMiddleware
