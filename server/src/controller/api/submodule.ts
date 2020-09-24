import BaseController from '~/src/controller/api/base'
import { Request, Response } from 'express'
import { JsonController, Param, Body, Req, Res, Get, Post, UseBefore } from 'routing-controllers'
import LoginMiddleware from '~/src/middleware/login'
import _ from 'lodash'
import MSubmodule from '~/src/model/submodule'

@JsonController()
@UseBefore(LoginMiddleware)
class ProjectController extends BaseController {
  @Post('/api/hetu/submodule/create')
  async create(@Req() request: Request, @Res() response: Response) {
    const userInfo = await this.asyncGetUserInfo(request)
    const create_ucid = `${userInfo.id}`
    const create_user_name = userInfo.name

    // 创建页面时额外接收content参数, 作为草稿页的初始值
    let { submodule, department, owner, desc, doc } = request.body
    let submoduleId = await MSubmodule.asyncCreate(
      submodule,
      department,
      owner,
      desc,
      doc,
      create_ucid,
      create_user_name,
    )
    if (submoduleId <= 0) {
      return this.showError('保存失败')
    }
    return this.showResult({}, '新增成功')
  }

  @Post('/api/hetu/submodule/update')
  async update(@Req() request: Request, @Res() response: Response) {
    const userInfo = await this.asyncGetUserInfo(request)
    const update_ucid = `${userInfo.id}`
    const update_user_name: string = userInfo.name
    let { id, submodule, department, owner, desc, doc } = request.body

    // 更新项目
    // @ts-ignore
    let affectRowsCount = await MSubmodule.asyncUpdate(id, {
      submodule,
      department,
      owner,
      desc,
      doc,
      update_ucid,
      update_user_name,
    })
    if (affectRowsCount === 0) {
      return this.showError('更新失败')
    }
    return this.showResult({}, '更新成功')
  }

  @Post('/api/hetu/submodule/delete')
  async delete(@Req() request: Request, @Res() response: Response) {
    let { id } = request.body
    const removeRowCount = await MSubmodule.asyncDelete(id)
    if (removeRowCount) {
      return this.showResult({}, '删除页面成功')
    }
    return this.showError('something is wrong')
  }

  @Get('/api/hetu/submodule/list')
  async list(@Req() request: Request, @Res() response: Response) {
    const { pageSize = 100, pageNum = 1 } = request.query as any
    const list = await MSubmodule.asyncGetList(pageNum, pageSize)
    if (_.isArray(list)) {
      return this.showResult({
        list,
        total: list.length,
      })
    }
    return this.showError('something is wrong')
  }
}

export default ProjectController
