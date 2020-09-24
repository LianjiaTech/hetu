import _ from 'lodash'
import moment from 'moment'
import Base from '~/src/model/base'
import Knex from '~/src/library/mysql'
import superAdminConfig from '~/src/config/superAdmin'

export type TypeProject = {
  id?: number
  project_code?: string
  name?: string
  description?: string
  home?: string
  logo?: string
  layout?: string
  proxy_success_code?: number
  proxy_domin?: string
  proxy_code_key?: string
  proxy_message_key?: string
  proxy_content_type?: string
  proxy_token_name?: string
  layout_type?: 'basic' | 'blank'
  department?: number
  submodules?: string
}

class Project extends Base {
  static TABLE_NAME = 'project_new'

  // 创建/更新 必传字段
  static requiredFields = ['department', 'name', 'project_code']

  static async getRole(ucid: string, project_id: number) {
    const hasSuperPermission = await this.hasSuperPermission(ucid)
    if (hasSuperPermission) {
      return 'super'
    }

    const projectDetail = await this.asyncGetByProjectId(project_id)
    const create_ucid = _.get(projectDetail, 'create_ucid', [])

    // 创建人具有项目权限
    if (ucid === create_ucid) {
      return 'super'
    }

    const item = await Knex('project_user')
      .select('*')
      .where('project_id', project_id)
      .andWhere('user_id', ucid)
      .first()

    return item ? item.role : null
  }

  // 是否拥有某项目的权限
  static async hasPermission(ucid: string, project_id: number) {
    const hasSuperPermission = await this.hasSuperPermission(ucid)
    if (hasSuperPermission) {
      return true
    }
    const projectDetail = await this.asyncGetByProjectId(project_id)
    const create_ucid = _.get(projectDetail, 'create_ucid', [])

    // 创建人具有项目权限
    if (ucid === create_ucid) {
      return true
    }

    const users = await Knex('project_user').select('*').where('project_id', project_id)

    return users.some((item: any) => item.user_id === ucid)
  }

  // 是否拥有某项目的权限
  static async hasPermissionByProjectCode(ucid: string, projectCode: string) {
    ucid = `${ucid}`
    const hasSuperPermission = await this.hasSuperPermission(ucid)
    if (hasSuperPermission) {
      return true
    }
    const projectDetail = await this.asyncGetByProjectCode(projectCode)
    const create_ucid = _.get(projectDetail, 'create_ucid', [])

    const project_id = _.get(projectDetail, 'id')

    if (project_id === undefined) {
      // 项目不存在
      return false
    }

    // 创建人具有项目权限
    if (ucid === create_ucid) {
      return true
    }

    const users = await Knex('project_new').select('*').where('project_id', project_id)
    return users.some((item: any) => item.user_id === `${ucid}`)
  }

  // 是否为超级管理员
  static async hasSuperPermission(ucid: string) {
    // 获取超级管理员所在的用户组
    let superAdminCode = superAdminConfig.projectCode
    let superAdminProject = await Knex('project_new')
      .select('*')
      .where('project_code', superAdminCode)
      .first('project_code')
    if (!superAdminProject) {
      throw new Error(`${superAdminCode} 不是超级管理员唯一标志`)
    }

    let project_id = superAdminProject.id

    const users = await Knex('project_user').select('*').where('project_id', project_id)

    // 判断是否为超级管理员
    return users.some((item: any) => item.user_id === ucid)
  }

  // 获取用户可访问的项目列表
  static async asyncGetProjectsByUcid(ucid: number) {
    return await Knex.queryBuilder()
      .select('*')
      .from(this.TABLE_NAME)
      .where('create_ucid', '=', ucid)
      .catch(this.dbSelectErrorHandler)
  }

  // 获取所有项目
  static async asyncGetAllProjects({
    department,
    pageSize,
    pageNum,
    minOrder = 0,
  }: {
    department?: number
    pageSize: number
    pageNum: number
    minOrder?: number
  }) {
    let offset = (pageNum - 1) * pageSize
    offset = offset > 0 ? offset : 0

    const query = Knex('project_new')
      .join('department', `project_new.department`, 'department.id')
      .select(
        '*',
        'project_new.id as id',
        'project_new.name as name',
        'project_new.department as departmentId',
        'project_new.order as projectOrder',
        'department.name as departmentName',
        'department.order as departmentOrder',
      )
      .where('project_new.order', '>', minOrder)
      .orderBy([
        { column: 'department.order', order: 'desc' },
        { column: 'project_new.order', order: 'desc' },
      ])
      .limit(pageSize)
      .offset(offset)

    let results = []
    if (_.isNumber(department) && !isNaN(department)) {
      results = await query.where('department', department)
    } else {
      results = await query
    }

    const item = await Knex.queryBuilder()
      .select('*')
      .from(this.TABLE_NAME)
      .where('project_new.order', '>', minOrder)
      .count({ total: '*' })

    const total = _.get(item, [0, 'total'], 0)

    return { results, total, pageNum, pageSize }
  }

  // 根据项目code获取项目详情
  static async asyncGetByProjectCode(project_code: string) {
    let rawRecordList = await Knex.queryBuilder()
      .select('*')
      .from(this.TABLE_NAME)
      .where('project_code', '=', project_code)
      .catch(this.dbSelectErrorHandler)
    let record = _.get(rawRecordList, [0], {}) as TypeProject
    return record
  }

  // 根据项目id获取项目详情
  static async asyncGetByProjectId(project_id: number) {
    let rawRecordList = await Knex.queryBuilder()
      .select('*')
      .from(this.TABLE_NAME)
      .where('id', '=', project_id)
      .catch(this.dbSelectErrorHandler)
    let record = _.get(rawRecordList, [0], {}) as TypeProject
    return record
  }

  // 创建项目
  static async asyncCreate(insertData: TypeProject, create_ucid: string, create_user_name: string) {
    let {
      name,
      project_code,
      description,
      home,
      logo,
      layout,
      proxy_success_code,
      department,
      submodules,
    } = insertData
    let nowAt = moment().unix()
    let affectRowCountList = await Knex.queryBuilder()
      .insert({
        name,
        project_code,
        description,
        home,
        logo,
        layout,
        proxy_success_code,
        department,
        submodules,
        create_at: nowAt,
        create_ucid,
        create_user_name,
      })
      .into(this.TABLE_NAME)
      .catch(this.dbInsertErrorHandler)
    let insertId: number = _.get(affectRowCountList, [0], 0)
    return insertId
  }

  // 更新项目
  static async asyncUpdate(project_id: number, data: TypeProject) {
    let affectRowCount: number = await Knex.queryBuilder()
      .update({
        ...data,
      })
      .from(this.TABLE_NAME)
      .where('id', '=', project_id)
      .catch(this.dbUpdateErrorHandler)
    return affectRowCount
  }

  // 删除项目
  static async asyncDelete(project_id: number) {
    let affectRowCount: number = await Knex.queryBuilder()
      .delete()
      .from(this.TABLE_NAME)
      .where('id', '=', project_id)
      .catch(this.dbDeleteErrorHandler)
    return affectRowCount
  }
}

export default Project
