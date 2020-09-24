import BaseController from '~/src/controller/api/base'
import { Request, Response } from 'express'
import { JsonController, Param, Body, Req, Res, Get, Post, Put, Delete, UseBefore } from 'routing-controllers'
import _ from 'lodash'
import Logger from '~/src/library/logger'
import LoginMiddleware from '~/src/middleware/login'
import Reporter from '~/src/model/reporter'

@JsonController()
@UseBefore(LoginMiddleware)
class emailController extends BaseController {
  // 所有部门上线周报, 这个是给河图超级管理员看的
  @Get('/api/hetu/email/online/department/week/all')
  async onlineWeekReportAll(@Req() request: Request) {
    try {
      const { users } = request.query as any
      if (!users) {
        return this.showError(`缺少参数users`)
      }
      const _users = users.split(',')

      const data = await Reporter.onlineReportAll({ users: _users })
      return this.showResult(data)
    } catch (e) {
      Logger('log.error', e)
      return this.showError(e.message)
    }
  }

  // 部门上线周报
  @Get('/api/hetu/email/online/department/week')
  async onlineWeekReport(@Req() request: Request) {
    try {
      const { departmentId, users } = request.query as any

      if (departmentId === undefined) {
        return this.showError(`缺少参数departmentId`)
      }

      if (!users) {
        return this.showError(`缺少参数users`)
      }
      const _users = users.split(',')
      const data = await Reporter.onlineReport(departmentId, { users: _users })

      return this.showResult(data, '邮件发送成功')
    } catch (e) {
      Logger('log.error', e)
      return this.showError(e.message)
    }
  }

  // 个人上线周报
  @Get('/api/hetu/email/online/personal/week')
  async personalOnlineReport(@Req() request: Request) {
    try {
      const { ucid } = request.query as any
      const data = await Reporter.personalOnlineReport(ucid)

      return this.showResult(data, '邮件发送成功')
    } catch (e) {
      Logger('log.error', e)
      return this.showError(e.message)
    }
  }

  // 所有部门开发报告
  @Get('/api/hetu/email/develop/department/week/all')
  async developWeekAll(@Req() request: Request) {
    try {
      const { users } = request.query as any
      if (!users) {
        return this.showError(`缺少参数users`)
      }
      const _users = users.split(',')

      const data = await Reporter.developReportAll({ users: _users })
      return this.showResult(data)
    } catch (e) {
      return this.showError(e.message)
    }
  }

  // 部门开发报告
  @Get('/api/hetu/email/develop/department/week')
  async developWeek(@Req() request: Request) {
    try {
      const { departmentId, users } = request.query as any

      if (!users) {
        return this.showError(`缺少参数users`)
      }
      const _users = users.split(',')

      if (departmentId === undefined) {
        return this.showError(`缺少参数departmentId`)
      }

      const data = await Reporter.developReport(departmentId, { users: _users })
      return this.showResult(data)
    } catch (e) {
      return this.showError(e.message)
    }
  }

  // 个人提效周报
  @Get('/api/hetu/email/develop/personal/week')
  async personalDevelopReport(@Req() request: Request) {
    try {
      const { ucid } = request.query as any
      const data = await Reporter.personalDevelopReport(ucid)

      return this.showResult(data, '邮件发送成功')
    } catch (e) {
      Logger('log.error', e)
      return this.showError(e.message)
    }
  }
}

export default emailController
