import _ from 'lodash'
import moment from 'moment'
import onlineRender, { IOnlineData } from './online_render'
import onlineWeekRender, { IOnlineWeekOptions } from './online_week_render'
import developmentWeekRender, { IDevelopmentOptions } from './development_week_render'
import Transporter from '~/src/library/email'
import knex from '~/src/library/mysql'
import env from '~/src/config/env'

type ICacheOptions = {
  expire?: number
}
class Cache<T> {
  constructor(fn: () => Promise<T>, options: ICacheOptions = {}) {
    if (typeof fn !== 'function') {
      throw new TypeError(`fn must be a function`)
    }
    this.getNew = fn
    const keys = Object.keys(options) as (keyof ICacheOptions)[]
    keys.forEach((key) => {
      this[key] = options[key] as any
    })
  }

  // 缓存的有效时间, 单位ms
  expire: number = 1 * 24 * 60 * 60 * 1000

  // 上一次修改时间, 单位ms
  lastModify?: number

  // 缓存值
  value: any

  // 获取值
  async get(): Promise<T> {
    let now = new Date().getTime()
    if (!this.lastModify || now - this.lastModify > this.expire) {
      this.lastModify = now
      this.value = await this.getNew()
    }

    return this.value
  }

  // 获取最新值
  getNew: Function
}

type IEmailType = 'online' | 'online-week' | 'development' | 'development-week'
type IEmail = string

type IRangeTime = {
  startTime: number
  endTime: number
}

/**
 * 发送邮件报告
 * @param type
 * @param title
 * @param users
 * @param options
 */
async function sendEmail(type: 'online', title: string, users: IUcid[], options: IOnlineData): Promise<any>
async function sendEmail(type: 'online-week', title: string, users: IUcid[], options: IOnlineWeekOptions): Promise<any>
async function sendEmail(
  type: 'development-week',
  title: string,
  users: IUcid[],
  options: IDevelopmentOptions,
): Promise<any>
async function sendEmail(type: IEmailType, title: string, users: IUcid[], options: any): Promise<any> {
  try {
    if (users.length === 0) {
      throw new Error(`users 不能为空`)
    }

    let to = await User.getEmailsFromUcids(users)
    if (env === 'dev') {
      to = ['1024371442@qq.com']
    }

    if (to.length === 0) {
      throw new Error(`to 不能为空`)
    }

    let sentMessageInfo
    let html
    switch (type) {
      case 'online':
        sentMessageInfo = await Transporter.sendEmail({
          to,
          subject: title || '上线报告',
          text: title || '上线报告',
          html: onlineRender(options),
        })
        break
      case 'online-week':
        html = onlineWeekRender(options)
        sentMessageInfo = await Transporter.sendEmail({
          to,
          subject: title || `上线周报`,
          text: title || `上线周报`,
          html,
        })
        break
      case 'development-week':
        html = developmentWeekRender(options)
        sentMessageInfo = await Transporter.sendEmail({
          to,
          subject: title,
          text: title,
          html,
        })
        break
    }

    return sentMessageInfo
  } catch (e) {
    e.message = `${type}邮件发送失败 ${e.message}`
    throw e
  }
}

// 16位ucid
type IUcid = string

class User {
  static emailCache: { [ucid: string]: Cache<string> } = {}
  static defaultUsers: string[] = []

  /**
   * 根据ucid获取email
   * @param users
   */
  static async getEmailsFromUcids(users: IUcid[]): Promise<IEmail[]> {
    let emailMap: { [key: string]: string } = {}

    let result = []
    for (let ucid of users) {
      if (_.get(emailMap, ucid)) {
        // 如果缓存中已存在
        result.push(_.get(emailMap, ucid))
      } else {
        // 如果缓存中不存在, 则调用接口获取
        const email = await this.getEmailFromUcid(ucid)
        if (email) {
          result.push(email)
          emailMap[ucid] = email
        }
      }
    }

    return result
  }

  static async getEmailFromUcid(ucid: string): Promise<string | null> {
    if (!this.emailCache[ucid]) {
      this.emailCache[ucid] = new Cache(async () => {
        const user = await knex('user').where('id', ucid).first()
        return _.get(user, 'email')
      })
    }

    return this.emailCache[ucid].get()
  }

  /**
   * 获取项目的所有用户
   */
  static async getProjectUsers(projectCode: string) {
    const project = await knex('project_new').where('project_code', projectCode).first()

    const users = await knex('project_user').where('project_id', project.id)

    const _users = users.map((v: any) => v.user_id)
    return _users
  }
}

class Project {
  static projectCache: { [departmentId: string]: any } = {}

  static projectOnlineDataCache: { [projectId: string]: Cache<any> } = {}

  /**
   * 获取用户相关的项目
   * @param ucidgetUserDevelopData
   */
  static async getProjectsByUser(ucid: string) {
    let users = await knex('project_user').where('user_id', ucid)
    if (_.isArray(users)) {
      const projectIds = users.map((v) => v.project_id)
      const projects = await knex('project_new').whereIn('id', projectIds).andWhere('order', '>', '9')
      return projects
    }
    return []
  }

  /**
   * 获取部门内的项目
   * @param projectId
   */
  static async getProjects(departmentId: string) {
    if (!_.get(this.projectCache, 'departmentId')) {
      let projects = await knex('project_new')
        .where('order', '>', 9)
        .andWhere('department', +departmentId)
      this.projectCache[departmentId] = projects
    }
    return this.projectCache[departmentId]
  }

  /**
   * 获取某项目的研发提效数据
   * @param projectCode
   * @param options
   */
  static async getProjectDevelopData(projectId: string, options: IRangeTime) {
    const project = await knex('project_new').where('id', projectId).first()
    const pages = await knex('page_record').where('project_id', projectId)
    project.pagesTotal = pages.length

    // 是否为新项目
    project.isNew = project.create_at >= options.startTime

    // 新增页面
    const newPages = pages.filter((v: any) => v.create_at >= options.startTime && v.create_at <= options.endTime)
    project.newPagesTotal = newPages.length
    if (newPages.length) {
      // 获取项目内所有的用户
      const _users = await knex('project_user').where('project_id', project.id).orderBy('role', 'desc')
      project.users = _users

      // 计算发布次数
      let publishCounts = 0
      for (let page of pages) {
        const publishs = await knex('page_publish_history')
          .where('page_id', page.id)
          .andWhere('env', 'test')
          .andWhereBetween('update_at', [options.startTime, options.endTime])
        if (publishs.length) {
          publishCounts += publishs.length
        }
      }
      project.publishCounts = publishCounts
    }

    return project
  }

  /**
   * 获取某项目的上线数据
   * @param projectCode
   * @param options
   */
  static async getOnlineData(projectId: string, options: IRangeTime) {
    if (!this.projectOnlineDataCache[projectId]) {
      this.projectOnlineDataCache[projectId] = new Cache(async () => {
        // 2. 获取所有的用户
        const users = await knex('project_user').where('project_id', projectId).orderBy('role', 'desc')
        // 3. 获取项目内所有的页面
        const pages = await knex('page_record').where('project_id', projectId)
        let onlineData: any[] = []
        let updateAtMap: any = {}
        if (_.isArray(pages) && pages.length) {
          // 4. 获取页面的发布记录
          for (let page of pages) {
            const publishs = await knex('page_publish_history')
              .where('page_id', page.id)
              .andWhere('env', 'prod')
              .andWhereBetween('update_at', [options.startTime, options.endTime])

            if (publishs && publishs.length) {
              // 以发布时间分组
              for (let i = 0; i < publishs.length; i++) {
                let { update_at, release_note, update_user_name } = publishs[i]
                if (updateAtMap[update_at]) {
                  updateAtMap[update_at].pages.push(page)
                } else {
                  updateAtMap[update_at] = {
                    pages: [page],
                    online_time: moment(update_at * 1000).format('MM.DD HH:mm'),
                    online_remark: release_note,
                    online_user_name: update_user_name,
                  }
                }
              }
            }
          }

          // 按照上线时间排序
          let updateAtList = Object.keys(updateAtMap).sort((a, b) => +b - +a)
          // 合并上线记录
          for (let key of updateAtList) {
            let list = updateAtMap[key]
            if (list.pages.length) {
              onlineData.push(list)
            }
          }
        }

        return {
          users,
          onlineData,
        }
      })
    }

    return this.projectOnlineDataCache[projectId].get()
  }
}

type IGlobalData = {
  globalPagesTotal: number
  globalProjectsTotal: number
  globalNewProjectTotal: number
  globalNewPagesTotal: number
}

class Department {
  static departmentCache: { [departmentId: string]: any } = {}
  static globalDataCache: Cache<IGlobalData>

  static projectDevelopDataCache: { [key: string]: Cache<any> } = {}

  /**
   * 获取所有部门的总项目数和总页面数
   * @param knex
   */
  static async getGlobalData(startTime: number, entTime: number) {
    if (!this.globalDataCache) {
      this.globalDataCache = new Cache<IGlobalData>(async () => {
        const departments = await knex('department').select('*')
        let week_start = startTime || moment('2019-01-01').unix()
        let week_end = entTime || moment().unix()
        let globalNewProjectTotal = 0
        let globalNewPagesTotal = 0
        for (let i = 0; i < departments.length; i++) {
          let department = departments[i]
          let { newPagesTotal, newProjectTotal } = await this.getDepartmentDevData(department.id, week_start, week_end)
          globalNewProjectTotal += newProjectTotal
          globalNewPagesTotal += newPagesTotal
        }

        const projects = await knex('project_new').where('order', '>', 9)
        let projectIds = projects.map((p: any) => p.id)
        let globalProjectsTotal = projects.length
        const pages = await knex('page_record').whereIn('project_id', projectIds)
        let globalPagesTotal = pages.length

        return { globalPagesTotal, globalProjectsTotal, globalNewProjectTotal, globalNewPagesTotal }
      })
    }

    return this.globalDataCache.get()
  }

  /**
   * 获取所有的部门
   * @param knex
   */
  static async getAllDepartment() {
    return knex('department').select('*').orderBy('order', 'desc')
  }

  /**
   * 根据departmentId获取部门信息
   * 无需区分环境,不同环境对应的数据是一致的
   * @param departmentId
   */
  static async getDepartment(departmentId: string) {
    if (!_.get(this.departmentCache, 'departmentId')) {
      let department = await knex('department')
        .where('id', +departmentId)
        .first()
      this.departmentCache[departmentId] = department
    }

    return this.departmentCache[departmentId]
  }

  /**
   * 获取某时间范围内部门上线数据
   * @param departmentId
   * @param start
   * @param end
   */
  static async getDepartmentOnlineData(departmentId: string, startTime: number, endTime: number) {
    const department = await this.getDepartment(departmentId)
    // 1. 获取部门内的项目
    let projects: any[] = await Project.getProjects(departmentId)
    let res = await this.getProjectsOnlineData(projects, startTime, endTime)
    return { ...res, department }
  }

  static async getProjectsOnlineData(projects: any, startTime: number, endTime: number) {
    let publishCounts = 0
    let pageCounts = 0
    let result: any[] = []
    let users = []

    for (let project of projects) {
      // 是否为新项目
      project.isNew = project.create_at >= startTime
      const { users: _users, onlineData } = await Project.getOnlineData(project.id, {
        startTime,
        endTime,
      })
      project.users = _users
      Array.isArray(_users) && users.push(..._users.map((v: any) => v.user_id))

      if (onlineData.length) {
        project.onlineData = onlineData
        result.push(project)
      }
    }

    users.push(...User.defaultUsers)
    // 去重
    users = Array.from(new Set(users))

    return { projects: result, pageCounts, publishCounts, users }
  }

  /**
   * 获取某时间范围内个人相关上线数据
   * @param departmentId
   * @param start
   * @param end
   */
  static async getUserOnlineData(ucid: string, startTime: number, endTime: number) {
    // 1. 获取项目
    let projects: any[] = await Project.getProjectsByUser(ucid)
    return this.getProjectsOnlineData(projects, startTime, endTime)
  }

  static async getProjectsDevData(projects: any[], startTime: number, endTime: number) {
    let result: any[] = []
    let newPagesTotal = 0
    let pagesTotal = 0
    let newProjectTotal = 0
    let projectsTotal = projects.length
    let users = []

    for (let p of projects) {
      // 2. 获取项目内的页面
      if (!this.projectDevelopDataCache[p.id]) {
        this.projectDevelopDataCache[p.id] = new Cache(async () => {
          return Project.getProjectDevelopData(p.id, { startTime, endTime })
        })
      }

      // 从缓存中获取
      const project = await this.projectDevelopDataCache[p.id].get()

      pagesTotal += project.pagesTotal
      newProjectTotal += project.isNew ? 1 : 0
      newPagesTotal += project.newPagesTotal
      Array.isArray(project.users) && users.push(project.users.map((v: any) => v.user_id))
      if (project.newPagesTotal) {
        result.push(project)
      }
    }

    result = result.sort((a, b) => b.newPagesTotal - a.newPagesTotal)
    users.push(...User.defaultUsers)

    // 去重
    users = Array.from(new Set(users))

    return { projectsTotal, projects: result, users, newPagesTotal, pagesTotal, newProjectTotal }
  }

  /**
   * 获取某时间范围内部门开发数据
   * @param departmentId
   * @param start
   * @param end
   */
  static async getDepartmentDevData(departmentId: string, start: number, end: number) {
    // 1. 获取部门内的项目
    let projects: any[] = await Project.getProjects(departmentId)

    return this.getProjectsDevData(projects, start, end)
  }

  /**
   * 获取某时间范围内个人相关研发提效数据
   * @param departmentId
   * @param start
   * @param end
   */
  static async getUserDevelopData(ucid: string, startTime: number, endTime: number) {
    // 1. 获取用户所在的项目
    let projects: any[] = await Project.getProjectsByUser(ucid)

    return this.getProjectsDevData(projects, startTime, endTime)
  }
}

class EmailUtils {
  static User = User

  static Project = Project

  static Department = Department

  static format(start: number, end: number) {
    return moment(start * 1000).format('YYYY.MM.DD') + '-' + moment(end * 1000).format('MM.DD')
  }

  static sendEmail = sendEmail
}

export default EmailUtils
