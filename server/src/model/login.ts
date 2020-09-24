import _ from 'lodash'
import Express, { Request, Response } from 'express'
import LoginConfig from '~/src/config/login'
import redisClient from '~/src/library/redis'
import MUser, { IUserInfo } from '~/src/model/user'

export default class MLogin {
  /**
   * 设置token
   * @param token
   * @param request
   * @param response
   * @param tokenName
   * @param isSecure
   */
  static setCookie(token: string, request: Request, response: Response, tokenName: string, isSecure = false) {
    let domain = request.hostname
    let options = { maxAge: LoginConfig.max_age, domain }
    if (!token) {
      options.maxAge = 0
    }

    let defaultOptions = {}
    if (request.headers['x-forwarded-proto'] === 'https' && isSecure) {
      defaultOptions = { sameSite: 'None', secure: true }
    }

    response.cookie(tokenName, token, Object.assign({}, options, { ...defaultOptions }))
  }

  /**
   * 获取原始请求的BaseURI（protocol 经过nginx转发之后, 可能发生变化）
   * @param request
   */
  static getBaseURI(request: Request) {
    let headerHost = request.headers['host'] || ''

    let port = _.get(headerHost.split(':'), 1, 0)
    let requestHost = _.get(headerHost.split(':'), 0, '127.0.0.1')
    let portSuffix = port ? `:${port}` : ''

    let protocol = request.headers['x-forwarded-proto'] || 'http'

    return `${protocol}://${requestHost}${portSuffix}`
  }

  /**
   * 从cookie中获取token, 根据token获取用户信息
   * @param token
   */
  static async getUserInfo(token: string): Promise<IUserInfo> {
    let email: any = await redisClient.get(token)

    if (!email) {
      throw new Error(`token已失效`)
    }

    const detail = await MUser.queryOne({ email })

    return detail
  }

  static async checkIsLogin(request: Request) {
    let token = _.get(request, ['cookies', LoginConfig.token_name], '')
    if (!token) {
      token = _.get(request, ['cookies', LoginConfig.token_name_secure], '')
    }

    if (!token) {
      return false
    }

    try {
      const userInfo = await this.getUserInfo(token)
      return !!_.get(userInfo, 'id')
    } catch (e) {
      return false
    }
  }

  static apiLoginFailed(request: Request, response: Response) {
    this.setCookie('', request, response, LoginConfig.token_name, false)
    this.setCookie('', request, response, LoginConfig.token_name_secure, true)

    return response.send({
      data: {},
      message: '请先登录',
      status: 408,
    })
  }
}
