import BaseController from '~/src/controller/api/base'
import { Request, Response } from 'express'
import _ from 'lodash'

import { JsonController, Param, Body, Req, Res, Get, Post, Put, Delete, UseBefore } from 'routing-controllers'
import { getAllValueFromRedis, cleanProjectConfig } from '~/src/controller/proxy/_utils'

@JsonController()
class HetuController extends BaseController {
  @Get('/api/hetu/info')
  async info(@Req() request: Request, @Res() response: Response) {
    try {
      const res = await this.asyncGetUserInfo(request)
      if (_.get(res, 'id')) {
        return this.showResult(res)
      }

      return this.showError('请先登录', {}, 408)
    } catch (e) {
      return this.showError(e.message, {}, 408)
    }
  }

  @Get('/api/redis/info')
  async redis(@Req() request: Request, @Res() response: Response) {
    const result = await getAllValueFromRedis()
    return this.showResult(result)
  }

  @Get('/api/redis/clean')
  async redisClean(@Req() request: Request, @Res() response: Response) {
    const { projectCode } = request.query

    if (projectCode === undefined) {
      return this.showError(`请设置projectCode`)
    }
    await cleanProjectConfig(`${projectCode}`)
    return this.showResult()
  }
}

export default HetuController
