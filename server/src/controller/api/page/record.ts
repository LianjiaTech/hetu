import BaseController from '~/src/controller/api/base'
import { Request } from 'express'
import { JsonController, Req, Get, Post, UseBefore } from 'routing-controllers'
import LoginMiddleware from '~/src/middleware/login'
import MPageRecord, { TypePageRecord } from '~/src/model/page/record'
import MPagePublishHistory from '~/src/model/page/publish_history'
import MPageDraft from '~/src/model/page/draft'
import MProject, { TypeProject } from '~/src/model/project'
import env from '~/src/config/env'
import _ from 'lodash'
import Knex from '~/src/library/mysql'

@JsonController()
@UseBefore(LoginMiddleware)
class PageController extends BaseController {
  // 增
  @Post('/api/page/record/create')
  async create(@Req() request: Request) {
    const userInfo = await this.asyncGetUserInfo(request)
    const create_ucid = `${userInfo.id}`
    const create_user_name = userInfo.name

    // 创建页面时额外接收content参数, 作为草稿页的初始值
    let { path, name, projectId, content = '' } = request.body

    // path, name 支持从content中获取, 方便导入页面配置
    if (!path) {
      let pageConfig = {}
      try {
        pageConfig = JSON.parse(content)
      } catch (e) {
        return this.showError(`content=>${content}不合法:${e.message}`)
      }

      path = _.get(pageConfig, 'route', path)
      name = _.get(pageConfig, 'title', name)
    }

    if (_.isUndefined(name)) {
      return this.showError(`name=>${name}不能为空`)
    }

    if (_.isUndefined(projectId)) {
      return this.showError(`projectId=>${projectId}不能为空`)
    }

    // @todo(yaozeyuan) 具体路径需要和元元确认一下
    if (/^\/project\/[\d_\w]+/.test(path) === false) {
      return this.showError(`path=>${path}路径不规范, path必须以/project/{项目代号}开头`)
    }

    // 检查path是否存在
    let isExist = await MPageRecord.asyncGetId(path)
    if (isExist > 0) {
      return this.showError(`路径${path}已存在`)
    }

    let pageId = await MPageRecord.asyncCreate(path, name, projectId, create_ucid, create_user_name)
    if (pageId <= 0) {
      return this.showError(`记录创建失败, 请重试`)
    }
    // 创建草稿
    let draftId = await MPageDraft.asyncCreate(pageId, content, create_ucid, create_user_name)

    return this.showResult(
      {
        path,
        pageId,
        draftId,
      },
      `创建成功`,
    )
  }

  // 删
  @Post('/api/page/record/delete')
  async delete(@Req() request: Request) {
    const userInfo = await this.asyncGetUserInfo(request)
    let { pageId, projectId } = request.body

    if (!pageId) {
      return this.showError('页面pageId不能为空')
    }

    let page = await MPageRecord.asyncGet(pageId)
    if (_.isEmpty(page)) {
      return this.showResult(`${pageId}对应页面不存在`)
    }

    const hasPermission = await MProject.hasPermission(`${userInfo.id}`, projectId)

    if (!hasPermission) {
      return this.showError(`您无权删除该页面`)
    }

    // 删除历史记录
    let removePublishHistoryRowCount = await MPagePublishHistory.asyncDeleteByPageId(pageId)

    // 删除所有草稿
    let removeDraftRowCount = await MPageDraft.asyncDeleteByPageId(pageId)

    // 删除页面记录
    let removePageRowCount = await MPageRecord.asyncDelete(pageId)

    if (removePageRowCount) {
      return this.showResult(
        {
          removePublishHistoryRowCount,
          removeDraftRowCount,
          removePageRowCount,
        },
        '删除页面成功',
      )
    } else {
      return this.showError(`删除页面失败`, {
        removePublishHistoryRowCount,
        removeDraftRowCount,
        removePageRowCount,
      })
    }
  }

  // 查
  @Get('/api/page/record/get')
  async get(@Req() request: Request) {
    let { path = '', draftId } = request.query as any //获取路径
    let pageId = await MPageRecord.asyncGetId(path)
    if (pageId === 0) {
      return this.showError(`页面${path}不存在`)
    }
    let page = await MPageRecord.asyncGet(pageId)
    let draft
    if (draftId) {
      draft = await MPageDraft.asyncGetByPageId(pageId, draftId)
      if (_.isEmpty(draft)) {
        return this.showError(`页面${path}指定对应的${draftId}不存在`)
      }
    } else {
      draftId = await MPagePublishHistory.asyncGetPublishDraftId(env, pageId)
      if (draftId === 0) {
        return this.showError(`页面${path}在${env}环境中的发布记录不存在`)
      }
      draft = await MPageDraft.asyncGet(draftId)
    }
    if (_.isEmpty(draft)) {
      return this.showError(`页面${path}在${env}环境中对应的配置内容不存在`)
    }

    const project_id = page.project_id
    // 获取页面对应的项目
    const project = await MProject.asyncGetByProjectId(project_id as number)
    if (!project.id) {
      return this.showError(`页面${path}对应的项目不存在:project_id=${project_id}`)
    }

    return this.showResult({
      page,
      draft,
    })
  }

  @Get('/api/page/record/get_list')
  async list(@Req() request: Request) {
    const { projectId, name, path, pageSize = 100, pageNum = 1, createUcid } = request.query as any
    let requestParamsTip = `projectId=>${projectId}`
    if (_.isUndefined(projectId)) {
      return this.showError(`projectId不能为空=>${requestParamsTip}`)
    }

    const userInfo = await this.asyncGetUserInfo(request)
    const actor_ucid = `${userInfo.id}`
    const hasPermission = await MProject.hasPermission(actor_ucid, projectId)
    if (!hasPermission) {
      return this.showError(`抱歉, 您无权访问该项目`, {}, 403)
    }

    let totalCount = await MPageRecord.asyncGetListCount(projectId, { name, path, createUcid })
    let rawRecordList = await MPageRecord.asyncGetList(projectId, pageNum, pageSize, { name, path, createUcid })
    let recordList: Array<TypePageRecord | { content: string }> = []
    for (let rawRecord of rawRecordList) {
      let content = ''
      let pageId = rawRecord.id as number
      let draftId = await MPagePublishHistory.asyncGetPublishDraftId(env, pageId)
      let draft = await MPageDraft.asyncGetByPageId(pageId)

      const page_draft_id_latest = _.get(draft, 'id')
      let is_latest = draftId === page_draft_id_latest

      if (draftId) {
        // 避免发布记录不存在
        let draft = await MPageDraft.asyncGet(draftId)
        content = _.get(draft, ['content'], '') as string
      }
      let record = {
        ...rawRecord,
        content: content,
        is_latest,
        page_draft_id: draftId,
        page_draft_id_latest,
        create_at: _.isNumber(rawRecord.create_at) && rawRecord.create_at * 1000,
        update_at: _.isNumber(rawRecord.update_at) && rawRecord.update_at * 1000,
      }
      recordList.push(record)
    }

    return this.showResult({
      total: totalCount,
      pageNum,
      pageSize,
      list: recordList,
    })
  }

  @Get('/api/v2/page/record/list')
  async listV2(@Req() request: Request) {
    const { project_id, content, pageSize = 50, pageNum = 1 } = request.query as any

    let offset = (pageNum - 1) * pageSize
    offset = offset < 0 ? 0 : offset

    if (!project_id) {
      return this.showError(`缺少参数project_id`)
    }

    if (project_id === 'unknow') {
      // 无主项目

      const projects = await Knex.queryBuilder().select('*').from('project_new')

      const project_ids: string[] = projects.map((v: any) => v.id)

      const pages = await Knex.queryBuilder().select('*').from('page_record').whereNotIn('project_id', project_ids)

      return this.showResult({
        list: pages,
        total: pages.length,
      })
    }

    if (project_id === 'all') {
      const projects = await Knex.queryBuilder().select('*').from('project_new')

      const project_ids: string[] = projects.map((v: any) => v.id)

      const pages: any[] = await Knex.queryBuilder()
        .select('*')
        .from('page_record')
        .whereIn('project_id', project_ids)
        .offset(offset)
        .limit(pageSize)

      const item = await Knex.queryBuilder()
        .select('*')
        .from('page_record')
        .whereIn('project_id', project_ids)
        .count({ total: '*' })

      const total = _.get(item, [0, 'total'], 0)

      let results = []
      for (let i = 0; i < pages.length; i++) {
        let page = pages[i]
        const page_draft = await Knex.queryBuilder()
          .select('*')
          .from('page_draft')
          .where('page_id', page.id)
          .orderBy('id', 'desc')
          .first()

        if (!page_draft) {
          continue
        }

        let isMatch = true
        if (content) {
          isMatch = page_draft.content.indexOf(content) !== -1
        }

        if (isMatch) {
          results.push(page)
        }
      }

      return this.showResult({
        list: results,
        total,
      })
    }
  }

  @Post('/api/page/record/batch_publish')
  async batchPublish(@Req() request: Request) {
    const { projectId, pageIdList, releaseNote = '批量发布', env } = request.body
    let userInfo = await this.asyncGetUserInfo(request)
    let requestParamsTip = `projectId=>${projectId},pageIdList=>${pageIdList},releaseNote=>${releaseNote},env=>${env}`

    if (_.isUndefined(projectId) || _.isUndefined(pageIdList) || _.isUndefined(releaseNote) || _.isUndefined(env)) {
      return this.showError(`projectId/pageIdList/releaseNote/env不能为空=>${requestParamsTip}`)
    }

    const actor_ucid = `${userInfo.id}`
    const actor_user_name = userInfo.name

    const hasPermission = await MProject.hasPermission(actor_ucid, projectId)
    if (!hasPermission) {
      return this.showError(`抱歉, 您没有权限发布页面`)
    }

    let publishFailedList = []
    let publishSuccessList = []
    let _pageIdList = pageIdList.split(',')
    // 批量发布
    for (let pageId of _pageIdList) {
      let page = await MPageRecord.asyncGet(pageId)
      if (_.isEmpty(page)) {
        publishFailedList.push({
          pageId,
          projectId,
          page,
          reason: 'pageId不存在',
        })
        continue
      }
      if (page.project_id != projectId) {
        publishFailedList.push({
          pageId,
          projectId,
          page,
          reason: `pageId${pageId}不属于项目=>${projectId}`,
        })
        continue
      }
      let draft = await MPageDraft.asyncGetByPageId(pageId)
      let draftId = _.get(draft, ['id'], 0)
      if (draftId === 0) {
        publishFailedList.push({
          pageId,
          projectId,
          page,
          reason: `pageId${pageId}没有对应的草稿记录`,
        })
        continue
      }
      let publishHistoryId = await MPagePublishHistory.asyncCreatePublishHistory(
        env,
        pageId,
        draftId,
        releaseNote,
        actor_ucid,
        actor_user_name,
      )
      if (publishHistoryId === 0) {
        publishFailedList.push({
          pageId,
          projectId,
          page,
          reason: `pageId${pageId}发布记录创建失败`,
        })
        continue
      }
      publishSuccessList.push({
        pageId,
        projectId,
        page,
        reason: `pageId${pageId}在${env}环境下发布成功`,
      })
    }

    let message = `共提交了${_.get(_pageIdList, ['length'], 0)}条记录, 发布成功${
      publishSuccessList.length
    }条, 发布失败${publishFailedList.length}条`
    return this.showResult(
      {
        publishSuccessList,
        publishFailedList,
      },
      message,
    )
  }
}

export default PageController
