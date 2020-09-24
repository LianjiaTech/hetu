import _ from 'lodash'
import moment from 'moment'
import schedule from 'node-schedule'
import path from 'path'
import shell from 'shelljs'

import Base from '~/src/commands/base'
import DATE_FORMAT from '~/src/constant/date_format'

import Util from '~/src/library/utils/modules/util'

let projectBaseUri = path.resolve(__dirname, '../../../') // 项目所在文件夹
class TaskManager extends Base {
  static get signature() {
    return `
    Task:Manager
    `
  }

  static get description() {
    return '任务调度主进程, 只能启动一次'
  }

  /**
   * 在最外层进行一次封装, 方便获得报错信息
   * @returns {Promise<void>}
   */
  async handle() {
    console.log('任务主进程启动')
    console.log('关闭其他TaskManager进程')
    await this.closeOtherTaskManager()
    console.log('其他TaskManager进程已关闭')
    console.log('避免当前还有正在运行的save2Log命令, 等待30s')
    console.log('开始休眠')
    for (let i = 0; i < 30; i++) {
      await Util.asyncSleep(1 * 1000)
      console.log(`休眠中, 第${i + 1}秒`)
    }
    console.log('休眠完毕')
    console.log('开始注册cron任务')

    // 注册定时任务
    // console.log('注册每分钟执行一次的任务')
    // this.registerTaskRepeatPer1Minute()
    // console.log('注册每10分钟执行一次的任务')
    // this.registerTaskRepeatPer10Minute()
    // console.log('注册每1小时执行一次的任务')
    // this.registerTaskRepeatPer1Hour()
    // console.log('注册每6小时执行一次的任务')
    // this.registerTaskRepeatPer6Hour()
    // console.log('注册每天执行一次的任务')
    // this.registerTaskRepeatPerEveryDay()
    console.log('注册每周执行一次的任务')
    this.registerTaskRepeatPerWeek()
    console.log('全部定时任务注册完毕, 等待执行')
  }

  async getOtherTaskMangerPidList() {
    // 命令本身也会被检测出来, sh -c npm run warning && NODE_ENV=development node dist/fee.js "Task:Manager"
    let command = 'ps aS|grep Task:Manager|grep node|grep hetu|grep -v grep | grep -v  \'"Task:Manager"\''
    console.log(`检测命令 => ${command}`)
    let rawCommandOutput = shell.exec(command, {
      async: false,
      silent: true,
    })
    let rawCommandOutputList = rawCommandOutput.split('\n')
    let taskManagerPidList: number[] = []
    for (let rawCommandOutput of rawCommandOutputList) {
      let commandOutput = _.trim(rawCommandOutput)
      commandOutput = _.replace(commandOutput, '\t', ' ')
      let pid: number = parseInt(commandOutput.split(' ')[0])
      if (_.isNumber(pid) && pid > 0) {
        if (pid !== process.pid) {
          taskManagerPidList.push(pid)
        }
      }
    }
    return taskManagerPidList
  }

  async closeOtherTaskManager() {
    let taskManagerPidList = await this.getOtherTaskMangerPidList()
    console.log('当前process.pid =>', process.pid)
    console.log(`其余TaskManger进程Pid列表 => `, taskManagerPidList)
    console.log('执行kill操作, 关闭其余进程')
    for (let pid of taskManagerPidList) {
      console.log(`kill pid => ${pid}`)
      try {
        process.kill(pid)
      } catch (e) {
        let message = `TaskManger进程pid => ${pid} kill失败, 该pid不存在或者没有权限kill`
        console.log(message)
      }
    }
    console.log('kill操作执行完毕, 休眠3s, 再次检测剩余TaskManager进程数')
    await Util.asyncSleep(3 * 1000)
    console.log('开始检测剩余TaskManager进程数')
    taskManagerPidList = await this.getOtherTaskMangerPidList()
    if (taskManagerPidList.length === 0) {
      console.log('剩余TaskManager为空, 可以继续执行任务调度进程')
      return true
    }
    // PM2 3.2.2 有bug, 无法保证TaskManager只有一个实例, 因此需要主动进行检测
    // 否则, 直接终止该进程
    let alertMessage =
      '仍然有残留TaskManager进程, 程序不能保证正常执行, 自动退出. 剩余 TaskManager pid List => ' +
      JSON.stringify(taskManagerPidList)
    console.warn(alertMessage)

    // 花式自尽
    process.kill(process.pid)
    process.exit(1)
  }

  /**
   * 每周四启动一次
   */
  async registerTaskRepeatPerWeek() {
    // 每周四早9点
    // '00 00 9 * * 4'  '00 */1 * * * *'
    schedule.scheduleJob('00 00 9 * * 4', () => {
      console.log('registerTaskRepeatPerWeeky 开始执行')

      const now = moment().format('YYYY-MM-DD')
      // TODO 即将废弃
      // 执行命令: 每周提效报告
      this.execCommand(`NODE_ENV=test node ${projectBaseUri}/dist/hetu.js Summary:DailyReport  ${now} week`)
      // 执行命令: 上线报告
      this.execCommand(`NODE_ENV=test node dist/hetu.js sendEmail:OnlineReport`)
      // 执行命令: 提效报告
      this.execCommand(`NODE_ENV=test node dist/hetu.js sendEmail:DevelopReport`)

      console.log('registerTaskRepeatPerWeek 执行完成')
    })
  }

  async execCommand(command: string) {
    console.log(`待执行命令=> ${command}`)
    let commandStartAtFormated = moment().format(DATE_FORMAT.DISPLAY_BY_MILLSECOND)
    let commandStartAtms = moment().valueOf()
    shell.exec(
      command,
      {
        async: true,
        silent: true,
      },
      () => {
        let commandFinishAtFormated = moment().format(DATE_FORMAT.DISPLAY_BY_MILLSECOND)
        let commandFinishAtms = moment().valueOf()
        let during = (commandFinishAtms - commandStartAtms) / 1000
        console.log(
          `${command}命令执行完毕, 共用时${during}秒, 开始执行时间=> ${commandStartAtFormated}, 执行完毕时间=> ${commandFinishAtFormated}`,
        )
      },
    )
  }
}

export default TaskManager
