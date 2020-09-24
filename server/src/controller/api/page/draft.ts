import BaseController from '~/src/controller/api/base'
import { Request } from 'express'
import { JsonController, Req, Res, Get, Post, UseBefore } from 'routing-controllers'
import LoginMiddleware from '~/src/middleware/login'
import MProject from '~/src/model/project'
import MPageRecord from '~/src/model/page/record'
import MPagePublishHistory from '~/src/model/page/publish_history'
import MPageDraft from '~/src/model/page/draft'
import _ from 'lodash'
import Util from '~/src/library/utils/modules/util'
import Knex from '~/src/library/mysql'

@JsonController()
@UseBefore(LoginMiddleware)
class PageDraftController extends BaseController {
  @Get('/api/page/draft/get')
  async getDraft(@Req() request: Request) {
    const { path, draftId } = request.query as any
    if (_.isUndefined(path)) {
      return this.showError(`path=>${path}不能为空`)
    }
    let pageId = await MPageRecord.asyncGetId(path)
    if (pageId <= 0) {
      return this.showError(`path=>${path}不存在`)
    }
    let page = await MPageRecord.asyncGet(pageId)
    if (_.isEmpty(page)) {
      return this.showError(`path=>${path}对应的记录不存在`)
    }
    let draft = await MPageDraft.asyncGetByPageId(pageId, draftId)
    if (_.isEmpty(draft)) {
      return this.showError(`path=>${path}/draftId=>${draftId}对应的记录不存在`)
    }
    return this.showResult({
      page,
      draft,
    })
  }

  @Post('/api/page/draft/save')
  async saveDraft(@Req() request: Request) {
    const userInfo = await this.asyncGetUserInfo(request)
    const create_ucid = `${userInfo.id}`
    const create_user_name = userInfo.name

    const { content = '', pageId = 0, projectId } = request.body

    if (!projectId) {
      return this.showError(`缺少参数projectId`)
    }

    const role = await MProject.getRole(create_ucid, projectId)

    if (role !== 'super') {
      return this.showError(`您不是管理员, 没有编辑权限`)
    }

    let draftId = await MPageDraft.asyncCreate(pageId, content, create_ucid, create_user_name)
    if (draftId <= 0) {
      return this.showError('保存失败')
    }

    // 更新页面path和name
    const { title: name, route: path } = Util.parseJSONWithDefault(content, {})
    let affectRowCount = await MPageRecord.asyncUpdate(pageId, { name, path }, create_ucid, create_user_name)
    if (affectRowCount <= 0) {
      return this.showError('保存失败')
    }

    return this.showResult(
      {
        pageId,
        draftId,
      },
      '保存成功',
    )
  }

  @Post('/api/page/draft/publish')
  async publish(@Req() request: Request) {
    const userInfo = await this.asyncGetUserInfo(request)
    const actor_ucid = `${userInfo.id}`
    const actor_user_name = userInfo.name

    const { env, projectId, draftId, pageId, releaseNote = '' } = request.body

    if (!projectId) {
      return this.showError('缺少参数projectId')
    }

    if (_.isUndefined(env) || _.isUndefined(draftId) || _.isUndefined(pageId)) {
      return this.showError(`env=>${env}/draftId=>${draftId}/pageId=>${pageId}均不能为空`)
    }

    const role = await MProject.getRole(actor_ucid, projectId)

    if (role !== 'super') {
      return this.showError('您没有发布权限')
    }

    // 检查页面是否存在
    let page = await MPageRecord.asyncGet(pageId)
    if (_.isEmpty(page)) {
      return this.showError(`发布失败.pageId=>${pageId}对应页面不存在`)
    }

    // 检查草稿/pageId是否存在
    let draft = await MPageDraft.asyncGetByPageId(pageId, draftId)
    if (_.isEmpty(draft)) {
      return this.showError(`发布失败.pageId=>${pageId}页面下不存在draftId=>${draftId}对应的记录`)
    }

    // 将草稿标记为已发布
    let affectRows = await MPageDraft.asyncMarkedAsPublish(draftId, actor_ucid, actor_user_name)
    if (affectRows <= 0) {
      return this.showError(`发布失败. 将draftId=>${draftId}/pageId=>${pageId}对应的草稿标记为已发布时操作失败`)
    }
    // 将草稿标记为已发布
    await MPageDraft.asyncMarkedAsPublish(draftId, actor_ucid, actor_user_name)
    // 发布完成后, 删除该页面下, 一天之前的所有未发布的草稿(节约数据库空间)
    await MPageDraft.asyncClearUnPublishDraft_1DayAgo(pageId)

    // 创建发布记录
    let historyId = await MPagePublishHistory.asyncCreatePublishHistory(
      env,
      pageId,
      draftId,
      releaseNote,
      actor_ucid,
      actor_user_name,
    )
    if (historyId <= 0) {
      return this.showError(`发布失败. 为draftId=>${draftId}/pageId=>${pageId}对应的草稿创建已发布记录时操作失败`)
    }

    return this.showResult({}, '发布成功')
  }

  // 删除记录
  @Post('/api/page/draft/delete')
  async delete(@Req() request: Request) {
    const { ids } = request.body

    if (!ids) {
      return this.showError('缺少参数ids')
    }
    let _ids = _.toString(ids).split(',')

    const status = await Knex('page_draft').whereIn('id', _ids).delete()

    if (status) {
      return this.showResult({ ids }, '删除成功')
    }

    return this.showError('删除失败')
  }
}

export default PageDraftController
