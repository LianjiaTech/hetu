import BaseController from '~/src/controller/api/base'
import { Request } from 'express'
import { JsonController, Req, Get, Post, UseBefore } from 'routing-controllers'
import LoginMiddleware from '~/src/middleware/login'
import MPageRecord from '~/src/model/page/record'
import MPagePublishHistory from '~/src/model/page/publish_history'
import _ from 'lodash'
import moment from 'moment'
import DATE_FORMAT from '~/src/constant/date_format'
import Knex from '~/src/library/mysql'

@JsonController()
@UseBefore(LoginMiddleware)
class PublishHistoryController extends BaseController {
  @Get('/api/page/publish_history/list')
  async list(@Req() request: Request) {
    const { path, env } = request.query as any
    if (_.isEmpty(env) || _.isEmpty(path)) {
      return this.showError(`参数错误:env/path不能为空. env=>${env}/path=>${path}`)
    }
    let pageId = await MPageRecord.asyncGetId(path)
    if (pageId === 0) {
      return this.showError(`path=>${path}对应的页面不存在`)
    }
    let rawHistoryList = await MPagePublishHistory.asyncGetPublishHistory(pageId, env)
    let historyList = []
    for (let rawHistory of rawHistoryList) {
      let pageId = rawHistory.page_id as number
      let page = await MPageRecord.asyncGet(pageId)
      // 格式化日期字符串, 方便前端展示
      let creatAt = rawHistory.create_at || 0
      let updateAt = rawHistory.update_at || 0
      let createAtStr = moment.unix(creatAt).format(DATE_FORMAT.DISPLAY_BY_SECOND)
      let updateAtStr = moment.unix(updateAt).format(DATE_FORMAT.DISPLAY_BY_SECOND)
      let history = {
        ...rawHistory,
        page,
        create_at: createAtStr,
        update_at: updateAtStr,
      }
      historyList.push(history)
    }
    return this.showResult({
      list: historyList,
      total: historyList.length,
    })
  }

  @Post('/api/page/publish_history/delete')
  async delete(@Req() request: Request) {
    const { ids } = request.body
    if (!ids) {
      return this.showError('缺少参数id')
    }

    let _ids = _.toString(ids).split(',')

    const status = await Knex('page_publish_history')
      .delete()
      .whereIn('id', _ids)

    if (status) {
      return this.showResult(
        {
          ids,
        },
        '删除成功',
      )
    }

    return this.showError('删除失败')
  }
}

export default PublishHistoryController
