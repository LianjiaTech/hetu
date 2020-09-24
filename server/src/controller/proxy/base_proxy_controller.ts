import { AxiosResponse } from 'axios'
import { Request, Response } from 'express'
import FormData from 'form-data'
import fs from 'fs'
import _ from 'lodash'
import qs from 'query-string'
import LoginConfig from '~/src/config/login'
import Base from '~/src/controller/proxy/base'
import http from '~/src/library/http'
import Logger from '~/src/library/logger'
import MProject from '~/src/model/project'

import { getProjectCode, getValueFromRedis, updateProjectConfigMap } from './_utils'

export type Method = 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'

export const HetuTokenName = LoginConfig.token_name

interface dynamicObject {
  [key: string]: any
}

interface CustomResponseData extends dynamicObject {
  status: number
  message: string
  data: any
}

class BaseProxyController extends Base {
  successCodeKey = 'status' // 请求成功状态字段

  successCode = 1 // 请求成功状值

  messageKey = 'message' // 提示信息的key

  dataKey = 'data' // 请求体字段

  tokenName = HetuTokenName // 传给业务方的tokenName, 用来验证登录状态

  contentType = 'application/json'

  /**
   * 处理请求后的逻辑
   * @param axiosResponse
   * @param req
   * @param res
   */
  async responseHandler(axiosResponse: AxiosResponse, req: Request, res: Response): Promise<CustomResponseData> {
    try {
      const responseStatus = _.get(axiosResponse, 'status') // http响应状态码, 2xx|3xx|4xx|5xx
      let responseData = _.get(axiosResponse, 'data') // http响应体
      const requestConfig = _.get(axiosResponse, 'config')

      const projectConfig = await getValueFromRedis(getProjectCode(req.path)) // 获取项目配置
      const proxyMessageKey = _.get(projectConfig, 'proxy_message_key', this.messageKey) // 提示消息字段
      const proxyCodeKey = _.get(projectConfig, 'proxy_code_key', this.successCodeKey) // 状态码字段
      const proxyDataKey = _.get(projectConfig, 'proxy_data_key', this.dataKey) // 状态码字段
      const proxySuccessCode = _.get(projectConfig, 'proxy_success_code', this.successCode) // 成功状态码

      const responseObj = responseData

      let message = _.get(responseData, [proxyMessageKey], '第三方接口异常') // 获取message
      if (message !== undefined) {
        responseData.message = message
      }

      if (responseStatus >= 300 || !_.isPlainObject(responseData)) {
        // 接口格式错误
        Logger('log.error', new Error(`${req.method} ${requestConfig.url} ${message}`))
        return this.showError(
          message,
          {
            ...requestConfig,
            data: responseObj,
          },
          500,
        )
      }

      if (proxyDataKey !== 'data') {
        let data = _.get(responseData, [proxyDataKey])
        if (data !== undefined) {
          // 当data存在时, 将值赋值给标准字段data
          responseData.data = data
          // 删除原来的字段, 避免请求响应过大
          delete responseData[proxyDataKey]
        }
      }

      let status = _.get(responseData, [proxyCodeKey], NaN) // 获取自定义请求状态码
      if (isNaN(status)) {
        // 如果proxySuccessCode不存在, 则获取code
        status = _.get(responseData, ['code'], NaN)
      }

      if (+status === +proxySuccessCode) {
        // 如果status等于用户定义的成功状态码
        responseData.status = 0
      } else {
        Logger('log.error', new Error(`${req.method} ${requestConfig.url} ${message}`))
        // 如果接口异常
        return this.showError(
          message,
          {
            ...requestConfig,
            response: responseObj,
          },
          status,
        )
      }

      let responseCookies = axiosResponse.headers['set-cookie']
      if (_.isArray(responseCookies)) {
        // 处理业务方返回的cookie
        for (let i = 0; i < responseCookies.length; i++) {
          // Path 特殊处理
          responseCookies[i] = responseCookies[i].replace(/(Path=[/\w]*;)\s*/, 'Path=/;')
        }
        // 将业务方返回来的cookie保存在浏览器中
        res.setHeader('Set-Cookie', responseCookies)
      }

      return responseData
    } catch (e) {
      Logger('log.api', [req, axiosResponse])
      e.message = `${req.method} ${req.protocol}://${req.hostname}${req.path} ${e.message}`
      Logger('log.error', e)
      throw e
    }
  }

  /**
   * 获取第三方请求的完整路径(域名+路径)
   * @param request
   */
  async asyncGetRequestUrl(request: Request, format: Boolean = false): Promise<string | Object> {
    try {
      const splitUrl = request.path.replace('//', '/').split('/') // 从url中获取项目唯一标识
      if (!_.isArray(splitUrl) || !_.isString(splitUrl[1])) {
        // splitUrl[1] 不存在
        return request.path
      }
      let projectCode = getProjectCode(request.path) // 项目唯一标识
      let proxy_domin = await getValueFromRedis([projectCode, 'proxy_domin']) // 根据projectCode获取域名
      if (!proxy_domin) {
        // 如果本地不存在, 则从数据库获取
        const project = await MProject.asyncGetByProjectCode(projectCode)
        if (!_.get(project, 'id')) {
          // 对应的项目不存在
          throw new Error(`${projectCode}对应的项目不存在`)
        }
        proxy_domin = project.proxy_domin
        // 更新缓存
        await updateProjectConfigMap(projectCode, project)
      }

      if (!proxy_domin) {
        throw new Error(`项目${projectCode}对应的业务方域名不存在`)
      }

      const regUrl = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
      if (!regUrl.test(proxy_domin)) {
        throw new Error(`项目${projectCode}对应的业务方域名格式错误 ${proxy_domin}`)
      }

      if (format) {
        return {
          proxy_domin,
          path: splitUrl.slice(2).join('/'),
        }
      } else {
        return proxy_domin + '/' + splitUrl.slice(2).join('/')
      }
    } catch (e) {
      Logger('log.error', e)
      throw e
    }
  }

  /**
   * 获取请求headers
   * @param request
   */
  async asyncGetRequestHeaders(request: Request): Promise<any> {
    const userInfo = await this.asyncGetUserInfo(request)

    if (!_.get(userInfo, 'id')) {
      throw new Error(`请先登录`)
    }

    let projectCode = getProjectCode(request.path) // 项目唯一标识
    const projectConfig = await getValueFromRedis(projectCode) // 获取项目配置

    const {
      proxy_token_name: proxyTokenName = this.tokenName,
      proxy_content_type: proxyContentType = this.contentType,
    } = projectConfig

    const ucId = _.get(userInfo, 'id', null)
    const ucAccount = _.get(userInfo, 'user_info.account', null)
    const cookie = parseCookie(request.headers.cookie)
    const cookieStr = stringifyCookie({ ...cookie, [proxyTokenName]: _.get(cookie, [HetuTokenName]) })

    let customHeaders: any = {
      ucId,
      ucAccount,
      cookie: cookieStr,
      'Content-Type': proxyContentType,
    }

    return customHeaders
  }

  /**
   * 获取请求参数
   * @param request
   */
  async asyncGetRequestConfig(request: Request): Promise<{ params?: object; data?: object }> {
    return { params: request.query, data: request.body }
  }

  /**
   * 通用请求
   * @param request
   * @param response
   */
  async request(request: Request, response: Response): Promise<CustomResponseData> {
    try {
      // 对上传文件进行特殊处理
      const contentType = _.get(request, ['headers', 'content-type'], this.contentType)
      if (contentType.indexOf('multipart/form-data') !== -1) {
        // @ts-ignore
        const file = _.get(request, ['files', 'file'])
        const { path: filePath, originalFilename, type, size } = file
        const f = fs.createReadStream(filePath) //创建读取流
        const form = new FormData() // new formdata实例
        form.append('file', f) // 把文件加入到formdata实例中
        form.append('filename', originalFilename)
        form.append('type', type)
        form.append('size', size)

        const projectCode = getProjectCode(request.path)
        const targetPath = request.path.split(projectCode)[1]
        let proxyDomin = await getValueFromRedis([projectCode, 'proxy_domin']) // 根据projectCode获取域名
        const result = await http.post(`${proxyDomin}${targetPath}`, form, {
          headers: form.getHeaders(),
        })
        return _.get(result, ['data', 'data'], result.data || '上传出错！')
      }

      const requestUrl = (await this.asyncGetRequestUrl(request)) as string
      const reqestHeaders = await this.asyncGetRequestHeaders(request)
      let requestConfig = await this.asyncGetRequestConfig(request)
      let projectCode = getProjectCode(request.path) // 项目唯一标识
      let proxyContentType = await getValueFromRedis([projectCode, 'proxy_content_type'], this.contentType) // 根据projectCode获取域名

      if (proxyContentType.indexOf('application/x-www-form-urlencoded') !== -1) {
        // 如果contentType为application/x-www-form-urlencoded
        let requestConfigData = _.get(requestConfig, 'data')
        if (_.isObject(requestConfigData)) {
          let data = qs.stringify(requestConfig.data as any)
          _.set(requestConfig, 'data', data)
        }
      }

      // @ts-ignore
      request._startTime_ = Date.now()
      const axiosResponse = await http({
        url: requestUrl,
        method: request.method,
        headers: reqestHeaders,
        ...requestConfig,
      })

      const result = this.responseHandler(axiosResponse, request, response)
      Logger('log.api', [request, axiosResponse])
      return result
    } catch (e) {
      const errorMessage = _.get(e, 'message', '请求失败')
      const errorStack = _.get(e, 'stack')
      Logger('log.error', e)
      return this.showError(errorMessage, errorStack, 500)
    }
  }
}

/**
 * 解析cookie
 * @param str
 */
export function parseCookie(str?: string): { [index: string]: string } {
  str = str ? `${str}` : ''
  let map = {} as {
    [key: string]: any
  }
  let arr = str.split(';')
  arr.forEach((item) => {
    let keyValue = item.split('=')
    map[keyValue[0].trim()] = keyValue[1]
  })
  return map
}

/**
 * 序列化cookie
 * @param cookies
 */
export function stringifyCookie(cookies: { [key: string]: string | undefined }): string {
  let cookieStr = ''

  if (_.isPlainObject(cookies)) {
    Object.keys(cookies).map((key) => {
      if (cookies[key] !== undefined) {
        cookieStr += `${key}=${cookies[key]}; `
      }
    })
  }
  return cookieStr
}

export default BaseProxyController
