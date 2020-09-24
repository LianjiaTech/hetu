import _ from 'lodash'
import request from '~/utils/request'

interface IRegisterParams {
  name: string
  email: string
  password: string
  verify_code: string
}

interface IModifyPasswordParams {
  email: string
  password: string
  verify_code: string
}

interface ILoginParams {
  email: string
  password: string
}

export default class Admin {
  /**
   * 用户注册
   */
  static async asyncRegister(params: IRegisterParams) {
    return request.post(`/api/admin/register`, params)
  }

  /**
   * 修改密码
   */
  static async asyncModifyPassword(params: IModifyPasswordParams) {
    return request.post(`/api/admin/password`, params)
  }

  /**
   * 用户登录
   */
  static async asyncLogin(params: ILoginParams) {
    return request.post(`/api/admin/login`, params)
  }

  /**
   * 获取验证码
   */
  static async asyncGetVerifyCode(email: string) {
    return request.post(`/api/admin/verify_code`, { email })
  }
}
