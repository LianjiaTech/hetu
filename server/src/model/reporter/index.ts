import moment from 'moment'
import _ from 'lodash'
import EmailUtils from './_utils'

interface IReportOptions {
  title?: string
  startTime?: number
  endTime?: number
  users?: string[]
}

class Reporter {
  // 所有部门上线周报, 这个是给河图超级管理员看的
  static async onlineReportAll(options: IReportOptions = {}) {
    // 国外一周从周日算起, 减3天, 从周四开始算
    const startTime = options.startTime || moment().startOf('week').subtract(3, 'day').unix()
    const endTime = options.endTime || moment().endOf('week').subtract(3, 'day').unix()
    const departments = await EmailUtils.Department.getAllDepartment()
    let result = []
    for (let i = 0; i < departments.length; i++) {
      let department = departments[i]
      let departmentData = await EmailUtils.Department.getDepartmentOnlineData(department.id, startTime, endTime)
      result.push({
        departmentName: `${departmentData.department.name}`,
        projects: departmentData.projects,
      })
    }

    let users = EmailUtils.User.defaultUsers
    if (_.isArray(options.users)) {
      users = options.users
    } else {
      users = await EmailUtils.User.getProjectUsers('admin')
    }

    const title = options.title || `每周上线数据统计(${EmailUtils.format(startTime, endTime)})`
    // 发送邮件
    const sentMessageInfo = await EmailUtils.sendEmail('online-week', title, users, {
      config: {
        title,
      },
      tableData: result,
    })

    return {
      sentMessageInfo,
      result,
    }
  }

  // 单个部门的上线报告
  static async onlineReport(departmentId: string, options: IReportOptions = {}) {
    // 国外一周从周日算起, 减3天, 从周四开始算
    const startTime = options.startTime || moment().startOf('week').subtract(3, 'day').unix()
    const endTime = options.endTime || moment().endOf('week').subtract(3, 'day').unix()
    const onlineData = await EmailUtils.Department.getDepartmentOnlineData(departmentId, startTime, endTime)

    const departmentName = onlineData.department.name
    // 邮件标题
    const title = options.title || `每周上线数据统计(${EmailUtils.format(startTime, endTime)})`
    const users = _.isArray(options.users) ? options.users : onlineData.users
    // 发送邮件
    const sentMessageInfo = await EmailUtils.sendEmail('online-week', `【${departmentName}】${title}`, users, {
      config: { title },
      tableData: [
        {
          departmentName: onlineData.department.name,
          projects: onlineData.projects,
        },
      ],
    })

    return {
      onlineData,
      sentMessageInfo,
    }
  }

  // 个人上线报告
  static async personalOnlineReport(ucid: string, options: IReportOptions = {}) {
    // 国外一周从周日算起, 减3天, 从周四开始算
    const startTime = options.startTime || moment().startOf('week').subtract(3, 'day').unix()
    const endTime = options.endTime || moment().endOf('week').subtract(3, 'day').unix()

    const { projects } = await EmailUtils.Department.getUserOnlineData(ucid, startTime, endTime)

    let result = []

    let departmentMap: any = {}
    if (_.isArray(projects)) {
      for (let i = 0; i < projects.length; i++) {
        let { department: departmentId } = projects[i]
        const department = await EmailUtils.Department.getDepartment(departmentId)

        if (departmentMap[departmentId]) {
          departmentMap[departmentId].projects.push(projects[i])
        } else {
          departmentMap[departmentId] = {
            departmentName: `${department.name}`,
            projects: [projects[i]],
          }
          result.push(departmentMap[departmentId])
        }
      }
    }

    if (result.length === 0) {
      return {
        ucid,
        options,
        message: '本周无上线',
      }
    }

    // 邮件标题
    const title = options.title || `每周上线数据统计(${EmailUtils.format(startTime, endTime)})`
    const users = [ucid]
    // 发送邮件
    const sentMessageInfo = await EmailUtils.sendEmail('online-week', `${title}`, users, {
      config: { title },
      tableData: result,
    })

    return {
      result,
      sentMessageInfo,
    }
  }

  // 所有部门开发报告
  static async developReportAll(options: IReportOptions = {}) {
    // 国外一周从周日算起, 减3天, 从周四开始算

    const startTime = options.startTime || moment().startOf('week').subtract(3, 'day').unix()
    const endTime = options.endTime || moment().endOf('week').subtract(3, 'day').unix()

    const {
      globalProjectsTotal,
      globalPagesTotal,
      globalNewPagesTotal,
      globalNewProjectTotal,
    } = await EmailUtils.Department.getGlobalData(startTime, endTime)

    const departments = await EmailUtils.Department.getAllDepartment()
    let result = []
    for (let i = 0; i < departments.length; i++) {
      let department = departments[i]
      let {
        projectsTotal,
        projects,
        newPagesTotal,
        pagesTotal,
        newProjectTotal,
      } = await EmailUtils.Department.getDepartmentDevData(department.id, startTime, endTime)
      if (projects.length) {
        result.push({
          config: {
            projectsTotal,
            newProjectTotal,
            pagesTotal,
            newPagesTotal,
            title: department.name,
          },
          tableData: projects,
        })
      }
    }

    // 按照总页面数排序
    result = result.sort((a, b) => b.config.pagesTotal - a.config.pagesTotal)

    let users = EmailUtils.User.defaultUsers
    if (_.isArray(options.users)) {
      users = options.users
    } else {
      users = await EmailUtils.User.getProjectUsers('admin')
    }

    // 邮件标题
    const title = options.title || `每周提效数据统计(${EmailUtils.format(startTime, endTime)})`
    // 发送邮件
    const sentMessageInfo = await EmailUtils.sendEmail('development-week', title, users, {
      config: {
        projectsTotal: globalProjectsTotal,
        pagesTotal: globalPagesTotal,
        newProjectTotal: globalNewProjectTotal,
        newPagesTotal: globalNewPagesTotal,
      },
      data: result,
    })

    return {
      result,
      sentMessageInfo,
    }
  }

  // 单个部门开发报告
  static async developReport(departmentId: string, options: IReportOptions = {}) {
    // 国外一周从周日算起, 减3天, 从周四开始算
    const startTime = options.startTime || moment().startOf('week').subtract(3, 'day').unix()
    const endTime = options.endTime || moment().endOf('week').subtract(3, 'day').unix()
    const department = await EmailUtils.Department.getDepartment(departmentId)

    const {
      globalProjectsTotal,
      globalPagesTotal,
      globalNewPagesTotal,
      globalNewProjectTotal,
    } = await EmailUtils.Department.getGlobalData(startTime, endTime)

    const {
      projects,
      projectsTotal,
      newPagesTotal,
      pagesTotal,
      newProjectTotal,
      users,
    } = await EmailUtils.Department.getDepartmentDevData(departmentId, startTime, endTime)

    const _users = _.isArray(options.users) ? options.users : users

    // 邮件标题
    const title = options.title || `每周提效数据统计(${EmailUtils.format(startTime, endTime)})`
    // 发送邮件
    const sentMessageInfo = await EmailUtils.sendEmail('development-week', title, _users, {
      config: {
        projectsTotal: globalProjectsTotal,
        pagesTotal: globalPagesTotal,
        newProjectTotal: globalNewProjectTotal,
        newPagesTotal: globalNewPagesTotal,
      },
      data: [
        {
          config: {
            projectsTotal,
            newProjectTotal,
            pagesTotal,
            newPagesTotal,
            title: department.name,
          },
          tableData: projects,
        },
      ],
    })

    return {
      result: projects,
      sentMessageInfo,
    }
  }

  // 个人开发报告
  static async personalDevelopReport(ucid: string, options: IReportOptions = {}) {
    // 国外一周从周日算起, 减3天, 从周四开始算
    const startTime = options.startTime || moment().startOf('week').subtract(3, 'day').unix()
    const endTime = options.endTime || moment().endOf('week').subtract(3, 'day').unix()

    const {
      globalProjectsTotal,
      globalPagesTotal,
      globalNewPagesTotal,
      globalNewProjectTotal,
    } = await EmailUtils.Department.getGlobalData(startTime, endTime)

    const { projects } = await EmailUtils.Department.getUserDevelopData(ucid, startTime, endTime)
    let departmentMap: any = {}
    let result = []
    for (let p of projects) {
      let { department: departmentId } = p
      const department = await EmailUtils.Department.getDepartment(departmentId)

      if (departmentMap[departmentId]) {
        departmentMap[departmentId].tableData.push(p)
      } else {
        departmentMap[departmentId] = {
          config: {
            title: department.name,
          },
          tableData: [p],
        }
        result.push(departmentMap[departmentId])
      }
    }

    const users = [ucid]

    if (result.length === 0) {
      return {
        ucid,
        options,
        message: '本周无上线',
      }
    }

    // 邮件标题
    const title = options.title || `每周提效数据统计(${EmailUtils.format(startTime, endTime)})`
    // 发送邮件
    const sentMessageInfo = await EmailUtils.sendEmail('development-week', title, users, {
      config: {
        projectsTotal: globalProjectsTotal,
        pagesTotal: globalPagesTotal,
        newProjectTotal: globalNewProjectTotal,
        newPagesTotal: globalNewPagesTotal,
      },
      data: result,
    })

    return {
      result,
      sentMessageInfo,
    }
  }
}

export default Reporter
