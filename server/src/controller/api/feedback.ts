import BaseController from '~/src/controller/api/base'
import { Request, Response } from 'express'
import { JsonController, Param, Body, Req, Res, Get, Post, UseBefore } from 'routing-controllers'
import LoginMiddleware from '~/src/middleware/login'
import _ from 'lodash'
import MFeedback from '~/src/model/feedback'

@JsonController()
@UseBefore(LoginMiddleware)
class FeedBackController extends BaseController {
  @Get('/api/hetu/feedback/list')
  async list(@Req() request: Request, @Res() response: Response) {
    const { pageSize = 100, pageNum = 1, type } = request.query
    // @ts-ignore
    let { results } = await MFeedback.asyncGetList({ type, pageSize, pageNum })
    // @ts-ignore
    let { total } = await MFeedback.asyncGetList({ type, pageSize: 1000, pageNum: 1 })
    if (_.isArray(results)) {
      return this.showResult({
        list: results,
        total,
      })
    }
    return this.showError('something is wrong')
  }

  @Post('/api/hetu/feedback/add')
  async create(@Req() request: Request) {
    const userInfo = await this.asyncGetUserInfo(request)
    const create_ucid = `${userInfo.id}`
    const create_user_name = userInfo.name // 用户名
    let { type, remark, score } = request.body
    let res = await MFeedback.asyncCreate(type, remark, score, create_ucid, create_user_name)
    if (res <= 0) {
      return this.showError('保存失败')
    }
    return this.showResult({}, '提交成功')
  }

  @Post('/api/hetu/feedback/delete')
  async delete(@Req() request: Request) {
    const { id } = request.body
    let res = await MFeedback.asyncDelete(id)
    if (res) {
      return this.showResult({}, '删除成功')
    }
    return this.showError('something is wrong')
  }
}

export default FeedBackController
