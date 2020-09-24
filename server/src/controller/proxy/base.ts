import _ from 'lodash'
import Express, { Request, Response } from 'express'
import MLogin from '~/src/model/login'
import LoginConfig from '~/src/config/login'

/**
 * 河图项目接口字段规范
 *
 * 只需要让前端知道:1. 接口响应是否成功 2. 弹出提示内容 两项即可. 页面跳转逻辑应该通过配置体现.
 *
 * status 用于辅助后端定位报错类型
 *
 *  1.  status
 *      1.  0 => 响应正常
 *      2.  1 => 响应异常
 *      3.  408 => 未登录
 *      4.  403 => 无权限
 *      5.  404 => 找不到页面
 *      6.  500 => 服务器错误
 *  2.  message
 *      1.  为空 => 略过该逻辑
 *      2.  存在内容 => 前端打印响应内容
 */

// 目前的路由最佳实践
// 文档地址 => https://github.com/typestack/routing-controllers

class BaseController {
  protected async asyncGetUserInfo(request: Request) {
    let token = _.get(request, ['cookies', LoginConfig.token_name], '')
    // 浏览器兼容, UcConfig.tokenName不存在, 再取UcConfig.tokenNameSecure
    if (!token) {
      token = _.get(request, ['cookies', LoginConfig.token_name_secure], '')
    }

    return MLogin.getUserInfo(token)
  }

  protected showResult(data = {}, message = '操作成功', status = 0) {
    return {
      data,
      message,
      status,
    }
  }

  protected showError(message = '操作失败', data = {}, status = 1) {
    return this.showResult(data, message, status)
  }
}
export default BaseController
