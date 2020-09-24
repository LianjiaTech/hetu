import BaseController from '~/src/controller/api/base'
import { Request, Response } from 'express'
import { JsonController, Req, Res, Get, Post, UseBefore } from 'routing-controllers'
import _ from 'lodash'
import MProject from '~/src/model/project'
import MUser from '~/src/model/user'
import LoginMiddleware from '~/src/middleware/login'
import Knex from '~/src/library/mysql'

@JsonController()
@UseBefore(LoginMiddleware)
class UserController extends BaseController {
  @Get('/api/hetu/user/search')
  async info(@Req() request: Request, @Res() response: Response) {
    try {
      const { q } = request.query as any
      if (!q) {
        return this.showResult([])
      }

      let users = await MUser.queryUsers(q)

      if (!_.isArray(users)) {
        return this.showResult([])
      }

      users = users.map((v) => {
        v.displayName = `${v.name} ${v.email}`
        v.displayValue = `${v.name} ${v.id}`
        return v
      })

      return this.showResult(users)
    } catch (e) {
      return this.showError(e.message)
    }
  }

  // 获取用户列表
  @Get('/api/hetu/user/list')
  async list(@Req() request: Request) {
    const { projectId } = request.query as any
    if (projectId === undefined) {
      return this.showError(`缺少参数projectId`)
    }

    const userInfo = await this.asyncGetUserInfo(request)
    const actor_ucid = `${userInfo.id}`
    const hasPermission = await MProject.hasPermission(actor_ucid, projectId)

    if (!hasPermission) {
      return this.showError(`抱歉, 您无权访问该项目`, {}, 403)
    }

    const users = await Knex('project_user').select('*').where('project_id', projectId).orderBy('role', 'desc')

    return this.showResult({
      list: users,
      total: users.length,
    })
  }

  // 添加用户
  @Post('/api/hetu/user/add')
  async add(@Req() request: Request) {
    const { projectId, displayValues } = request.body
    if (projectId === undefined) {
      return this.showError(`缺少参数projectId`)
    }

    if (displayValues === undefined) {
      return this.showError(`缺少参数displayValue`)
    }

    const userInfo = await this.asyncGetUserInfo(request)
    const actor_ucid = `${userInfo.id}`
    const actor_user_name = userInfo.name
    const hasPermission = await MProject.hasPermission(actor_ucid, projectId)

    if (!hasPermission) {
      return this.showError(`抱歉, 您无权访问该项目`, {}, 403)
    }

    let errors = []
    // TODO 判断用户是否已经存在
    for (let item of displayValues) {
      const value = item.split(' ')
      const user_id = value[1]
      const user_name = value[0]

      const isExist = await Knex('project_user')
        .select('*')
        .where('project_id', projectId)
        .andWhere('user_id', user_id)
        .first()

      if (isExist) {
        continue
      }

      const insertResult = await Knex.queryBuilder()
        .insert({
          project_id: projectId,
          user_id,
          user_name,
          role: 'ordinary',
          create_user_id: actor_ucid,
          create_user_name: actor_user_name,
        })
        .into('project_user')

      const insertId = _.get(insertResult, [0], 0)

      if (insertId <= 0) {
        errors.push(item)
      }
    }

    if (errors.length) {
      return this.showError(`用户添加失败`, { errors })
    }

    return this.showResult(displayValues, `用户添加成功`)
  }

  // 删除用户
  @Post('/api/hetu/user/delete')
  async delete(@Req() request: Request) {
    const { projectId, id } = request.body
    if (projectId === undefined) {
      return this.showError(`缺少参数projectId`)
    }

    if (id === undefined) {
      return this.showError(`缺少参数user_id`)
    }

    const userInfo = await this.asyncGetUserInfo(request)
    const actor_ucid = `${userInfo.id}`
    const hasPermission = await MProject.hasPermission(actor_ucid, projectId)

    if (!hasPermission) {
      return this.showError(`抱歉, 您无权访问该项目`, {}, 403)
    }

    const affectRowCount = await Knex.queryBuilder()
      .delete()
      .from('project_user')
      .where('id', id)
      .andWhere('project_id', projectId)

    if (affectRowCount) {
      return this.showResult(`用户删除成功`)
    }

    return this.showError(`用户删除失败`)
  }

  // 更新用户
  @Post('/api/hetu/user/update')
  async update(@Req() request: Request) {
    const { projectId, id, role } = request.body
    if (projectId === undefined) {
      return this.showError(`缺少参数projectId`)
    }

    if (id === undefined) {
      return this.showError(`缺少参数id`)
    }

    if (role === undefined) {
      return this.showError(`缺少参数role`)
    }

    const userInfo = await this.asyncGetUserInfo(request)
    const actor_ucid = `${userInfo.id}`
    const hasPermission = await MProject.hasPermission(actor_ucid, projectId)

    if (!hasPermission) {
      return this.showError(`抱歉, 您无权访问该项目`, {}, 403)
    }

    let affectRowCount = await Knex.queryBuilder()
      .update({
        role,
      })
      .from('project_user')
      .where('project_id', projectId)
      .andWhere('id	', id)

    if (affectRowCount) {
      return this.showResult(`切换成功`)
    }

    return this.showError(`切换失败`)
  }
}

export default UserController
