import Base, { IArgs } from '~/src/commands/base'
import Reporter from '~/src/model/reporter'
import knex from '~/src/library/mysql'

class DevelopReport extends Base {
  static get signature() {
    return `
      sendEmail:DevelopReport
    `
  }

  static get description() {
    return '河图提效报告'
  }

  async execute(args: IArgs, options: IArgs) {
    // @ts-ignore
    console.log(`开始执行 sendEmail:DevelopReport`)
    // 发送给河图管理员
    await Reporter.developReportAll()
    const adminProject = await knex('project_new').where('project_code', 'admin').first()
    // 1. 获取所有的用户
    const users = await knex('project_user').whereNot('project_id', adminProject.id).groupBy('user_id')
    // @ts-ignore
    this.info(`开始向${users.length}个用户, 发送研发提效报告`)
    for (let i = 0; i < users.length; i++) {
      try {
        // 发送报告
        let logMsg = `[${i + 1}] ${users[i].user_name}${users[i].user_id} 发送提效报告`
        console.time(logMsg)
        await Reporter.personalDevelopReport(users[i].user_id)
        console.timeEnd(logMsg)
      } catch (e) {
        console.error(e)
      }
    }
    // @ts-ignore
    this.info(`全部报告发送完毕`)
  }
}

export default DevelopReport
