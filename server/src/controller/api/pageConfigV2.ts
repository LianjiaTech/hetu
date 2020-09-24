import BaseController from '~/src/controller/api/base'
import { Request, Response } from 'express'
import { JsonController, Req, Res, Get, Post, UseBefore } from 'routing-controllers'
import fs from 'fs'
import path from 'path'
import LoginMiddleware from '~/src/middleware/login'
import knex from '~/src/library/mysql'
import _ from 'lodash'
import moment from 'moment'
import MProject from '~/src/model/project'

interface uploadPage {
  path: string
  name: string
  create_at: string
  create_ucid: string
  create_user_name: string
  content: string
}

@JsonController()
@UseBefore(LoginMiddleware)
class PageConfigV2Controller extends BaseController {
  @Get('/api/pageConfig/list/download')
  async downloadList(@Req() request: Request, @Res() response: Response) {
    const { ids, projectId } = request.query as any

    const pageIds = ids.split(',')

    let project = await knex('project_new').select('*').where('id', projectId).first('id')

    interface composedPageRecord {
      id: number
      path: string
      name: string
      project_id: number
      create_at: string
      create_user_name: string
      content: string
    }
    let composedPageRecords: composedPageRecord[] = await knex('page_record')
      .join('page_draft', 'page_record.id', 'page_draft.page_id')
      .whereIn('page_record.id', pageIds)
      .andWhere('page_record.project_id', projectId)
      .orderBy('page_draft.id', 'desc')

    let pageDraftMap = {} as { [key: string]: any }
    const results = composedPageRecords.filter((composedPageRecord) => {
      const path = composedPageRecord.path
      if (pageDraftMap[path]) {
        return false
      }
      pageDraftMap[path] = 1
      return true
    })

    const filename = project.project_code + '.' + moment(new Date()).format('YYYY-MM-DD') + '.json'
    response.setHeader('Content-type', 'application/octet-stream')
    response.setHeader('Content-Disposition', `attachment;filename=${filename}`)

    return {
      project,
      pages: results,
    }
  }

  @Post('/api/v2/pageConfig/list/upload')
  async uploadPages(@Req() request: Request, @Res() response: Response) {
    try {
      const userInfo = await this.asyncGetUserInfo(request)
      const update_ucid = `${userInfo.id}`
      const update_user_name = `${userInfo.name}`

      const { fileUrls, projectId } = request.body

      if (projectId === undefined) {
        return this.showError('缺少projectId')
      }

      if (!_.isArray(fileUrls) && fileUrls[0]) {
        return this.showError('缺少fileUrls')
      }

      const regUrl = /^\/hetu-cdn\/.+/i
      let fileUrl = fileUrls[0]

      if (!regUrl.test(fileUrl)) {
        return this.showError(`${fileUrl} 不是合法的url`)
      }

      // 从本地读取文件
      const axiosResponse = fs.readFileSync(path.resolve(__dirname, `../../${fileUrl}`))
      const axiosResponseData = axiosResponse.toString()

      const { project, pages } = JSON.parse(axiosResponseData)

      let project_code = _.get(project, 'project_code')
      let project_name = _.get(project, 'name')
      if (project_code === undefined) {
        return this.showError('上传文件中缺少project_code字段')
      }

      const _project = await knex('project_new').select('*').where('project_code', project_code).first('project_code')

      if (!_project) {
        return this.showError(`项目${project_name}(${project_code})不存在, 请创建项目之后, 再导入配置`)
      }

      const { id: project_id } = _project

      if (projectId - project_id !== 0) {
        return this.showError('导入的配置, 不属于当前项目', {
          uploadProject: project,
          actualProject: _project,
        })
      }

      const canUpdate = await MProject.hasPermission(update_ucid, project_id)
      if (!canUpdate) {
        return this.showError(`抱歉, 您没有权限导入`)
      }

      if (!_.isArray(pages)) {
        this.showError('上传文件中pages字段格式错误')
      }

      let uploadSuccessPages: uploadPage[] = []
      let uploadSuccessPagesMap = {} as { [key: string]: any }
      let page: uploadPage
      for (let i = 0; i < pages.length; i++) {
        page = pages[i]
        // 判断页面配置是否合法
        let isPageValid = checkUploadPage(page)
        if (!isPageValid) {
          continue
        }

        const { path, name, create_at, create_ucid, create_user_name, content } = page
        let nowAt = moment().unix()

        // 判断页面配置是否存在
        let pageRecord = await knex('page_record').where('path', page.path).first()
        if (!pageRecord) {
          // 页面不存在
          pageRecord = {
            path,
            name,
            project_id,
            create_at,
            create_ucid,
            create_user_name,
            update_at: nowAt,
            update_ucid,
            update_user_name,
          }
          // 创建页面
          let affectRowCountList = await knex('page_record').insert(pageRecord)
          let pageId: number = _.get(affectRowCountList, [0])
          if (pageId === undefined) {
            // 页面创建失败
            continue
          }
          pageRecord.id = pageId
        } else {
          // 页面配置已存在
          let affectRowCount = await knex('page_record')
            .update({
              name,
              update_at: nowAt,
              update_ucid,
              update_user_name,
            })
            .where('path', path)

          if (affectRowCount === 0) {
            // 更新失败
            continue
          }
        }

        // 添加一条草稿记录
        let pageDraft = {
          page_id: pageRecord.id,
          is_publish: 0,
          content,
          create_at,
          create_ucid,
          create_user_name,
        }
        let affectRowCountList = await knex('page_draft').insert(pageDraft)
        let pageDraftId: number = _.get(affectRowCountList, [0])
        if (pageDraftId === undefined) {
          // pageDraft创建失败
          continue
        }
        uploadSuccessPages.push(page)
        uploadSuccessPagesMap[path] = page
      }

      const uploadFaildPages = pages.filter((page: any) => !uploadSuccessPagesMap[page.path])
      const message = `成功导入${uploadSuccessPages.length}条, 失败${uploadFaildPages.length}条`
      return this.showResult(
        {
          uploadSuccessPages,
          uploadFaildPages,
        },
        message,
      )
    } catch (e) {
      return this.showError(_.get(e, 'message', '服务器异常'), e, 500)
    }
  }
}

/**
 * 校验页面配置字段
 * @param { uploadPage } page
 */
function checkUploadPage(page: uploadPage): boolean {
  if (!_.isPlainObject(page)) return false

  const requiredFields: (keyof uploadPage)[] = [
    'path',
    'name',
    'create_at',
    'create_ucid',
    'create_user_name',
    'content',
  ]

  return requiredFields.every((key) => page[key] !== undefined)
}

export default PageConfigV2Controller
