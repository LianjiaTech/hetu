// @ts-ignore
import { Command } from '@adonisjs/ace'

export interface IArgs {
  [key: string]: any
}

/**
 * @adonisjs/ace文档 https://adonisjs.com/docs/4.1/ace
 */

class Base extends Command {
  // The command signature defines the command name, required/optional options, and flags.
  static get signature() {
    return `
      commandName
    `
  }

  static get description() {
    return '命令描述'
  }

  /**
   * 在最外层进行一次封装, 方便获得报错信息
   * @param {IArgs} args
   * @param {IArgs} options
   * @returns {Promise<void>}
   */
  async handle(args: IArgs, options: IArgs) {
    console.log('command start', args, options)
    await this.execute(args, options).catch((e) => {
      console.log('catch error', e.stack)
    })
    console.log('command finish')
  }

  async execute(args: IArgs, options: IArgs) {
    throw new Error(`子类必须实现execute方法`)
  }
}

export default Base
