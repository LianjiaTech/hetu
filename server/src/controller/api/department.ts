import BaseController from '~/src/controller/api/base'
import { Request, Response } from 'express'
import { JsonController, Param, Body, Req, Res, Get, Post, Put, Delete, UseBefore } from 'routing-controllers'
import LoginMiddleware from '~/src/middleware/login'
import _ from 'lodash'
import MDepartment from '~/src/model/department'

@JsonController()
@UseBefore(LoginMiddleware)
class ProjectController extends BaseController {
  @Get('/api/department/list')
  async List(@Req() request: Request, @Res() response: Response) {
    const list = await MDepartment.asyncGetAll()
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
