import _ from 'lodash'
import RandExp from 'randexp'
import { Request, Response } from 'express'
import { Controller, Req, Res, Get, Post } from 'routing-controllers'
import moment from 'moment'
import LoginConfig from '~/src/config/login'
import BaseController from '~/src/controller/api/base'
import MLogin from '~/src/model/login'
import Transporter from '~/src/library/email'
import RedisClient from '~/src/library/redis'
import MUser from '~/src/model/user'
import MValidator from '~/src/model/validator'

const Redis_verify_code_key = `verify_code_`
// 验证码失效时间, 单位秒
const Verify_code_expries = 10 * 60
// code失效时间, 单位秒
const Code_expries = 10
// token失效时间, 单位秒
const Token_expries = 24 * 3600

/**
 * 验证"验证码"是否正确
 * @param email
 * @param verifyCode
 */
async function checkVerifyCode(email: string, verify_code: string) {
  let verify_code_string = await RedisClient.get(`${Redis_verify_code_key}${email}`)

  if (!verify_code_string) {
    throw new Error(`验证码已过期`)
  }

  if (verify_code_string !== verify_code) {
    throw new Error(`验证码错误`)
  }

  return true
}

/**
 * 创建用于登录的code
 * @param email
 */
async function createCode(email: string) {
  const randexp = new RandExp(/[a-zA-Z0-9]{18}/)
  const code = randexp.gen()
  // 设置缓存, 10秒过期
  await RedisClient.set(code, email, 'EX', Code_expries)
  return code
}

/**
 * 创建用于登录的token
 * @param email
 */
async function createToken(email: string) {
  const randexp = new RandExp(/[a-zA-Z0-9]{22}/)
  const token = randexp.gen()
  // 设置缓存, 10秒过期
  await RedisClient.set(token, email, 'EX', Token_expries)
  return token
}

@Controller('/api/admin')
class OauthController extends BaseController {
  // 注册
  @Post('/register')
  async register(@Req() request: Request, @Res() response: Response) {
    try {
      const { email, name, password, verify_code } = request.body as any

      MValidator.checkRequiredFields(['email', 'name', 'password', 'verify_code'], request.body)

      await checkVerifyCode(email, verify_code)

      const detail = await MUser.queryOne({ email })
      if (detail) {
        return this.showError(`${email}已注册`)
      }

      const res = await MUser.create({
        email,
        name,
        password,
      })
      return this.showResult(res, `注册成功`)
    } catch (e) {
      return this.showError(e.message)
    }
  }

  // 登录
  @Get('/login')
  async login_get(@Req() request: Request, @Res() response: Response) {
    const { code, gotoURL = '/' } = request.query as any

    if (!code) {
      const isLogin = await MLogin.checkIsLogin(request)
      if (isLogin) {
        // 已登录
        response.redirect(gotoURL)
        return
      }
    }

    const email = await RedisClient.get(code)
    // 删除redis缓存, 避免二次使用
    await RedisClient.del(code)

    if (!email) {
      // code已过期, 重定向到登录页
      response.redirect(`/user/login?gotoURL=${encodeURIComponent(gotoURL)}`)
      return
    }

    // 创建token
    const token = await createToken(email)
    MLogin.setCookie(token, request, response, LoginConfig.token_name, false)
    MLogin.setCookie(token, request, response, LoginConfig.token_name_secure, true)

    response.redirect(gotoURL)
    return
  }

  // 登录
  @Post('/login')
  async login_post(@Req() request: Request, @Res() response: Response) {
    try {
      const { email, password } = request.body as any
      const isMatch = await MUser.checkPassword(email, password)
      if (isMatch) {
        const code = await createCode(email)
        return this.showResult({ code }, `登录成功`)
      }

      return this.showError(`密码错误`)
    } catch (e) {
      return this.showError(e.message)
    }
  }

  // 退出登录
  @Get('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    try {
      const { gotoURL } = request.query as any
      const { token_name, token_name_secure } = LoginConfig
      const redirectLogoutURL = `/user/login?gotoURL=${encodeURIComponent(gotoURL)}`
      // 清空token
      MLogin.setCookie('', request, response, token_name, false)
      MLogin.setCookie('', request, response, token_name_secure, true)
      response.redirect(redirectLogoutURL)

      return
    } catch (e) {
      console.error(e)
      return this.showError(e.message)
    }
  }

  // 获取验证码
  @Post('/verify_code')
  async verify_code(@Req() request: Request, @Res() response: Response) {
    try {
      const { email } = request.body as any
      if (!email) {
        return this.showError(`缺少参数email`)
      }

      const now = moment.now()
      const last_send_time_key = `last_send_time_`
      const last_send_time = await RedisClient.get(`${last_send_time_key}${email}`)

      if (last_send_time && Number(last_send_time) - now < 60) {
        // 时间间隔小于60秒
        return this.showError(`两次发送间隔不足60s`)
      }

      const randexp = new RandExp(/[0-9]{6}/)

      const verify_code = randexp.gen()

      const sentMessageInfo = await Transporter.sendEmail({
        to: [email],
        subject: '河图验证码',
        text: '',
        html: `您的验证码为: ${verify_code}`,
      })

      await RedisClient.set(`${last_send_time_key}${email}`, `${now}`)
      await RedisClient.set(`${Redis_verify_code_key}${email}`, verify_code, 'EX', Verify_code_expries)

      return this.showResult(sentMessageInfo)
    } catch (e) {
      return this.showError(e.message)
    }
  }

  // 修改密码
  @Post('/password')
  async psd_modify(@Req() request: Request, @Res() response: Response) {
    try {
      const { email, password, verify_code } = request.body as any
      await checkVerifyCode(email, verify_code)
      await MUser.update(email, {
        password,
      })
      return this.showResult(`密码修改成功`)
    } catch (e) {
      return this.showError(e.message)
    }
  }

  @Get('/redis/info')
  async redisInfo(@Req() request: Request, @Res() response: Response) {
    return this.showResult(RedisClient.cacheMap)
  }
}

export default OauthController
