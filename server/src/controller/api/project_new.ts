import { Request, Response } from 'express'
import { JsonController, Param, Body, Req, Res, Get, Post, Put, Delete, UseBefore } from 'routing-controllers'
import _ from 'lodash'
import moment from 'moment'

import BaseController from '~/src/controller/api/base'
import { cleanProjectConfig } from '~/src/controller/proxy/_utils'
import LoginMiddleware from '~/src/middleware/login'
import MPageRecord from '~/src/model/page/record'
import MProject, { TypeProject } from '~/src/model/project'
import Util from '~/src/library/utils/modules/util'
import env from '~/src/config/env'
import Knex from '~/src/library/mysql'

interface TypeProjectItem extends TypeProject {
  id: number
  pagesTotal?: number
  departmentId?: number
  departmentName?: string
}

@JsonController()
@UseBefore(LoginMiddleware)
class ProjectController extends BaseController {
  //创建
  @Post('/api/v2/hetu/project/create')
  async create(@Req() request: Request) {
    const userInfo = await this.asyncGetUserInfo(request)
    const actor_ucid = `${userInfo.id}`
    const actor_user_name = userInfo.name

    // 获取页面配置
    let { project_code } = request.body

    // 组装数据, 自动过滤掉undefined的值
    let insertProjectData: { [key: string]: string } = {}
    let dataKeyList = [`name`, `project_code`, `department`]
    for (let dataKey of dataKeyList) {
      if (_.has(request.body, dataKey)) {
        insertProjectData[dataKey] = request.body[dataKey]
      }
    }

    // 必传字段校验
    const requiredFields = MProject.requiredFields

    for (let item of requiredFields) {
      if (_.isUndefined(insertProjectData[item])) {
        return this.showError(`${item}不能为空`)
      }
    }

    // 检查project_code是否存在
    let project = await MProject.asyncGetByProjectCode(project_code)

    if (project.id) {
      return this.showError(`项目创建失败, 项目:${project_code}已存在`)
    }

    insertProjectData.layout = JSON.stringify({ type: 'blank', menu_data: [] })
    // 创建项目
    let projectId = await MProject.asyncCreate(insertProjectData, actor_ucid, actor_user_name)
    if (projectId === 0) {
      return this.showError('创建失败')
    }

    // 创建管理员
    const insertId = await Knex.queryBuilder()
      .insert({
        project_id: projectId,
        user_name: actor_user_name,
        user_id: actor_ucid,
        role: 'super',
        create_user_id: '',
        create_user_name: '系统',
      })
      .into('project_user')

    if (!insertId) {
      return this.showError('创建失败')
    }

    return this.showResult({ projectId }, '创建成功')
  }

  // 修改项目
  @Post('/api/v2/hetu/project/update')
  async update(@Req() request: Request) {
    const userInfo = await this.asyncGetUserInfo(request)
    const actor_ucid = `${userInfo.id}`

    // 获取页面配置
    let { id: project_id, project_code } = request.body

    // 权限判断
    const canUpdate = await MProject.hasPermission(actor_ucid, project_id)

    if (!canUpdate) {
      // 没有权限
      return this.showError(`没有权限`)
    }

    // 必传字段校验
    const requiredFields = [
      'id',
      'project_code',
      'name',
      'layout_type',
      'proxy_domin',
      'proxy_code_key',
      'proxy_success_code',
      'proxy_message_key',
      'proxy_data_key',
      'whitelist',
      'department',
    ]
    for (let item of requiredFields) {
      if (_.isUndefined(request.body[item])) {
        return this.showError(`${item}不能为空`)
      }
    }

    // 检查project_code是否存在
    let project = await MProject.asyncGetByProjectCode(project_code)

    if (_.get(project, 'id') && project.id !== +project_id) {
      return this.showError(`更新失败, project_code:${project_code}已存在`)
    }

    let dataKeyList = [
      `name`,
      `home`,
      'proxy_domin',
      'proxy_code_key',
      'proxy_success_code',
      'proxy_message_key',
      'proxy_data_key',
      'proxy_token_name',
      'proxy_content_type',
      'whitelist',
      'department',
      'logo',
      'submodules',
    ]

    // 组装数据, 自动过滤掉undefined的值
    let updateProjectData: { [key: string]: string } = {}
    for (let dataKey of dataKeyList) {
      if (_.has(request.body, dataKey)) {
        let _value = request.body[dataKey]
        switch (dataKey) {
          case 'logo':
            updateProjectData[dataKey] = _.isArray(_value) && _value[0] ? _value[0] : ''
            break

          default:
            updateProjectData[dataKey] = _value
        }
      }
    }

    const owner = request.body.owner

    if (!owner || !_.isPlainObject(owner)) {
      return this.showError('缺少参数owner')
    }

    if (owner.key) {
      updateProjectData.create_ucid = owner.key
      updateProjectData.create_user_name = owner.label.split(' ')[0]
    } else {
      return this.showError(`参数owner格式错误`)
    }

    let layout_menu_data = request.body.layout_menu_data

    if (_.isString(layout_menu_data)) {
      layout_menu_data = JSON.parse(layout_menu_data)
    }

    const layout = {
      type: request.body.layout_type,
      menu_data: layout_menu_data,
    }

    updateProjectData.layout = JSON.stringify(layout)

    let { is_api_sign, accessKeyId, accessKeySecret } = request.body
    updateProjectData.is_api_sign = is_api_sign
    if (is_api_sign) {
      updateProjectData.accessKeyId = accessKeyId
      updateProjectData.accessKeySecret = accessKeySecret
    }

    // 更新项目
    let affectRowsCount = await MProject.asyncUpdate(project_id, updateProjectData)
    if (affectRowsCount === 0) {
      return this.showError('更新失败')
    }

    // 清空项目缓存
    await cleanProjectConfig(project_code)

    return this.showResult(affectRowsCount, '更新成功')
  }

  // 获取用户有权限的项目列表
  @Get('/api/v2/hetu/project/list')
  async list(@Req() request: Request, @Res() response: Response) {
    try {
      const userInfo = await this.asyncGetUserInfo(request)
      const ucid = `${userInfo.id}`
      const { pageSize = 1000, pageNum = 1, department, projectType } = request.query as any

      const isSuper = await MProject.hasSuperPermission(ucid)
      // 如果为超级管理员, 则返回全部项目

      if (isSuper) {
        let results = await Knex('project_new')
          .innerJoin('department', 'project_new.department', 'department.id')
          .select(
            '*',
            'project_new.id as id',
            'project_new.name as name',
            'project_new.department as departmentId',
            'project_new.order as projectOrder',
            'department.name as departmentName',
            'department.order as departmentOrder',
          )
          .orderBy([
            { column: 'department.order', order: 'desc' },
            { column: 'project_new.order', order: 'desc' },
          ])
          .limit(pageSize)
          .offset((pageNum - 1) * pageSize)

        results = results.map((v: any) => ({ ...v, role: 'super' }))

        const totalItem = await Knex.queryBuilder().select('*').from('project_new').count({ total: '*' }).first()

        const total = totalItem.total

        // 排序
        return this.showResult({
          total,
          list: results,
        })
      }

      // 如果不是超级管理员
      const results = await Knex('project_new')
        .innerJoin('department', 'project_new.department', 'department.id')
        .innerJoin('project_user', 'project_new.id', 'project_user.project_id')
        .select(
          'project_new.*',
          'project_new.order as projectOrder',
          'department.order as departmentOrder',
          'project_new.department as departmentId',
          'department.name as departmentName',
          'project_user.role as role',
        )
        .andWhere('project_user.user_id', ucid)
        .orderBy([
          { column: 'department.order', order: 'desc' },
          { column: 'project_new.order', order: 'desc' },
        ])
        .limit(pageSize)
        .offset((pageNum - 1) * pageSize)

      const totalItem = await Knex('project_new')
        .innerJoin('project_user', 'project_new.id', 'project_user.project_id')
        .select('project_new.*')
        .andWhere('project_user.user_id', ucid)
        .count({ total: '*' })
        .first()

      const total = totalItem.total

      return this.showResult({
        list: results,
        total,
      })
    } catch (e) {
      return this.showError(e.message || '服务器错误')
    }
  }

  // 获取某业务线的数据
  @Get('/api/v3/hetu/project/list/department')
  async departmentDataV3(@Req() request: Request, @Res() response: Response) {
    try {
      let { department, rangePicker } = request.query as any

      if (department === undefined) {
        return this.showError(`缺少参数department`)
      }

      let _rangePicker
      if (rangePicker) {
        _rangePicker = rangePicker.split(',')
        if (_.isArray(_rangePicker)) {
          _rangePicker = _rangePicker.map((v) => moment(v).unix())
        }
      }

      let { results: projects } = await MProject.asyncGetAllProjects({
        department: +department,
        pageSize: 10000,
        pageNum: 1,
        minOrder: 9,
      })

      // 项目总数
      let pagesTotal = 0
      // 范围内新增项目数
      let newPagesTotal = 0
      // 获取新增项目数
      for (let i = 0; i < projects.length; i++) {
        let project = projects[i]
        const records = await Knex('page_record').where('project_id', project.id)

        if (_.isArray(records)) {
          // 当前项目的页面总数
          project.pagesTotal = records.length
          pagesTotal += records.length

          if (_rangePicker) {
            project.isNew = project.create_at >= _rangePicker[0]
            // 计算新增页面数量
            const newRecords = await Knex('page_record')
              .where('project_id', project.id)
              .whereBetween('create_at', _rangePicker)
            project.newPagesTotal = newRecords.length
            project.oldPagesTotal = project.pagesTotal - newRecords.length
            newPagesTotal += newRecords.length
          }
        }
        delete project.layout
      }

      // @ts-ignore
      let _results: any[] = projects.filter((v) => v.pagesTotal > 0).sort((a, b) => b.pagesTotal - a.pagesTotal)

      // 图表数据
      let chartData = []
      for (let i = 0; i < _results.length; i++) {
        // @ts-ignore
        _results[i].index = i + 1
        chartData.push({
          ..._results[i],
          _chart_type_: '新增页面',
          _chart_total_: _results[i].newPagesTotal,
        })
        chartData.push({
          ..._results[i],
          _chart_type_: '页面总数',
          _chart_total_: _results[i].pagesTotal,
        })
      }

      return this.showResult({
        total: _results.length,
        pagesTotal,
        newPagesTotal,
        list: _results,
        chartData,
      })
    } catch (e) {
      return this.showError(e.message || '服务器错误')
    }
  }

  // 获取所有的项目列表
  @Get('/api/v3/hetu/project/list/all')
  async allDataV3(@Req() request: Request, @Res() response: Response) {
    try {
      let {} = request.query

      let { results, total } = await MProject.asyncGetAllProjects({ pageSize: 10000, pageNum: 1, minOrder: 9 })

      // 河图一期页面 164*2 个
      const { total: totalPageCounts, projects } = await Util.getTotalPage(results)

      // @ts-ignore
      let _results = projects.sort((a, b) => b.pagesTotal - a.pagesTotal)

      interface DepartmentMap {
        [key: string]: {
          departmentId: number
          departmentName: string
          pagesTotal: number
          页面总数: number
          projectTotal: number
          项目总数: number
          projects: TypeProjectItem[]
        }
      }

      let departmentMap: DepartmentMap = {}
      _results.map((v) => {
        let { departmentId, departmentName, pagesTotal } = v

        if (departmentId === undefined || departmentName === undefined || pagesTotal === 0) return

        if (_.isPlainObject(departmentMap[`${departmentId}`])) {
          // 已存在
          departmentMap[`${departmentId}`].projects.push(v)
          departmentMap[`${departmentId}`].projectTotal += 1
          departmentMap[`${departmentId}`].项目总数 += 1
          departmentMap[`${departmentId}`].pagesTotal += pagesTotal || 0
          departmentMap[`${departmentId}`].页面总数 += pagesTotal || 0
        } else {
          // 不存在
          departmentMap[`${departmentId}`] = {
            departmentId,
            departmentName,
            projectTotal: 1,
            项目总数: 1,
            pagesTotal: v.pagesTotal || 0,
            页面总数: v.pagesTotal || 0,
            projects: [v],
          }
        }
      })

      let list: any[] = []
      Object.keys(departmentMap).map((v) => {
        list.push(departmentMap[v])
      })
      list = list.sort((a, b) => b.pagesTotal - a.pagesTotal).map((v, i) => ({ ...v, index: i + 1 }))

      return this.showResult({
        total,
        totalPageCounts,
        list,
      })
    } catch (e) {
      return this.showError(e.message || '服务器错误')
    }
  }

  // 获取所有的项目列表
  @Get('/api/v4/hetu/project/list')
  async listAll4(@Req() request: Request, @Res() response: Response) {
    try {
      let { pageSize = 1000, pageNum = 1 } = request.query as any
      let offset = (pageNum - 1) * pageSize
      offset = offset < 0 ? 0 : offset

      let projects = await Knex('project_new').select('*').offset(offset).limit(pageSize)
      let item = await Knex('project_new').select('*').count({ total: '*' })

      const total = _.get(item, [0, 'total'], 0)
      return this.showResult({
        total,
        list: projects,
      })
    } catch (e) {
      return this.showError(e.message || '服务器错误')
    }
  }

  // 删除项目
  @Post('/api/v2/hetu/project/delete')
  async delete(@Req() request: Request, @Res() response: Response) {
    try {
      const userInfo = await this.asyncGetUserInfo(request)
      const actor_ucid = `${userInfo.id}`

      let { id: project_id } = request.body

      // 权限判断
      const canDelete = await MProject.hasPermission(actor_ucid, project_id)

      if (!canDelete) {
        return this.showError('无权删除')
      }

      if (_.isUndefined(project_id)) {
        return this.showError('project_id为必填项')
      }

      let rawRecordList = await MPageRecord.asyncGetList(project_id, 1, 1000)

      let num = _.get(rawRecordList, 'length', 0)
      if (num > 0) {
        return this.showError('请先删除项目中的页面, 再删除项目')
      }

      const project = await MProject.asyncGetByProjectId(project_id)

      const projectCode = _.get(project, 'project_code')

      if (!projectCode) {
        return this.showError(`项目project_id=${project_id}不存在`)
      }

      const affectRowsCount = await MProject.asyncDelete(project_id)

      if (affectRowsCount === 0) {
        return this.showError('删除失败')
      }

      // 清空proxyHost缓存
      cleanProjectConfig(projectCode)

      return this.showResult(affectRowsCount, '删除成功')
    } catch (e) {
      return this.showError(e.message)
    }
  }

  // 获取项目详情
  @Get('/api/v2/hetu/project/detail')
  async get(@Req() request: Request, @Res() response: Response) {
    const userInfo = await this.asyncGetUserInfo(request)
    let currentUcid = `${userInfo.id}`

    let { id: project_id, path: page_path, checkRole } = request.query as any

    let project: any = {}

    if (page_path) {
      let pageId = await MPageRecord.asyncGetId(page_path) // 根据页面路径获取项目详情
      if (pageId === 0) {
        // 如果页面不存在
        return this.showError(`页面${page_path}对应的项目不存在`, {}, 404)
      }
      let page = await MPageRecord.asyncGet(pageId)
      project_id = page.project_id
    }

    if (!_.isUndefined(project_id)) {
      project = await MProject.asyncGetByProjectId(project_id) // 根据project_id获取项目详情
    }

    if (!_.get(project, 'id')) {
      return this.showError(`项目不存在:project_id=${project_id}`)
    }

    // 是否拥有项目权限
    const role = await MProject.getRole(currentUcid, project_id as number)

    if (checkRole && role !== 'super') {
      return this.showError('您无权访问该项目', {}, 403)
    }

    project.role = role

    project.env = Util.parseJSONWithDefault(project.env, {})

    const layout = Util.parseJSONWithDefault(project.layout, {})
    project.layout = layout
    for (let key in layout) {
      project[`layout_${key}`] = layout[key]
    }

    if (!project.proxy_domin) {
      // 如果domin不存在, 则从proxy_host里面获取
      const proxy_host = Util.parseJSONWithDefault(project.proxy_host, {})
      const _env = env === 'prod' ? env : 'test'
      project.proxy_domin = _.get(proxy_host, _env)
    }

    if (project.proxy_code_key === undefined) {
      project.proxy_code_key = 'status'
    }
    if (project.proxy_success_code === undefined) {
      project.proxy_success_code = 1
    }
    if (project.proxy_message_key === undefined) {
      project.proxy_message_key = 'message'
    }
    if (project.proxy_content_type === undefined) {
      project.proxy_content_type = 'application/json'
    }
    if (project.proxy_token_name === undefined) {
      project.proxy_token_name = 'proxy_token_name'
    }

    project.owner = {
      label: `${project.create_user_name} ${project.create_ucid}`,
      key: project.create_ucid,
    }

    return this.showResult(project)
  }
}

export default ProjectController
