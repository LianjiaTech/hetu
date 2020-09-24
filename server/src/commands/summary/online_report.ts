import Base from '~/src/commands/base'
import Reporter from '~/src/model/reporter'
import knex from '~/src/library/mysql'

class OnlineReport extends Base {
  static get signature() {
    return `
      sendEmail:OnlineReport
    `
  }

  static get description() {
    return '河图上线报告'
  }

  async execute(args: string[], options: string[]) {
    console.log(`开始执行 sendEmail:OnlineReport`)
    // 发送给河图管理员
    // await Reporter.onlineReportAll()
    const adminProject = await knex('project_new').where('project_code', 'admin').first()
    // 1. 获取所有的用户
    const users = await knex('project_user').whereNot('project_id', adminProject.id).groupBy('user_id')
    // @ts-ignore
    this.info(`开始向${users.length}个用户, 发送上线报告`)
    for (let i = 0; i < users.length; i++) {
      try {
        // 发送报告
        let logMsg = `[${i + 1}] ${users[i].user_name}${users[i].user_id} 发送上线报告`
        console.time(logMsg)

        // 发送报告
        await Reporter.personalOnlineReport(users[i].user_id)
        console.timeEnd(logMsg)
      } catch (e) {
        console.error(e)
      }
    }
    // @ts-ignore
    this.info(`全部上线报告发送完毕`)
  }
}

export default OnlineReport
