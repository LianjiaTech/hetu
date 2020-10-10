import _ from 'lodash'
import moment from 'moment'
import Base from '~/src/model/base'
import Knex from '~/src/library/mysql'

export type IUserInfo = {
  id: number
  email: string
  name: string
  password: string
  create_time?: number
  update_time?: number
}

class Account extends Base {
  static TABLE_NAME = 'user'

  /**
   * 创建账号
   * @param params
   */
  static async create(params: Omit<IUserInfo, 'id' | 'create_time'>) {
    const affectRowCountList = await Knex.insert({
      ...params,
      create_time: moment().unix(),
      update_time: moment().unix()
    })
      .into(this.TABLE_NAME)
      .catch(this.dbInsertErrorHandler)

    let insertId: number = _.get(affectRowCountList, [0], 0)
    return insertId
  }

  /**
   * 更新账号信息
   */
  static async update(id: string, params: Partial<Omit<IUserInfo, 'id' | 'create_time'>>) {
    const affectRowCountList = await Knex(this.TABLE_NAME)
      .update({ ...params, update_time: moment().unix() })
      .where('id', id)
      .catch(this.dbUpdateErrorHandler)

    let insertId: number = _.get(affectRowCountList, [0], 0)
    return insertId
  }

  /**
   * 删除账号
   */
  static async delete(id: string) {
    const affectRowCountList = await Knex(this.TABLE_NAME).delete().where('id', id).catch(this.dbDeleteErrorHandler)

    let insertId: number = _.get(affectRowCountList, [0], 0)
    return insertId
  }

  /**
   * 查询账号信息
   */
  static async queryOne({ email, id }: { id?: string; email?: string }) {
    const query = Knex.queryBuilder().from(this.TABLE_NAME)

    if (id) {
      query.where('id', id)
    }

    if (email) {
      query.where('email', email)
    }

    const detail = await query.select('id', 'email', 'name', 'create_time').first().catch(this.dbSelectErrorHandler)

    return detail
  }

  /**
   * 验证账号密码
   * @param email
   */
  static async checkPassword(email: string, password: string) {
    const detail = await Knex(this.TABLE_NAME)
      .select('*')
      .where('email', email)
      .first()
      .catch(this.dbSelectErrorHandler)

    return _.get(detail, 'password') === password
  }

  /**
   * 根据输入内容模糊搜索
   * @param s
   */
  static async queryUsers(s: string) {
    const list = await Knex(this.TABLE_NAME)
      .select('id', 'email', 'name', 'create_time')
      .where('email', 'like', `%${s}%`)
      .orWhere('name', 'like', `%${s}%`)
      .catch(this.dbSelectErrorHandler)

    return list
  }

  /**
   * 查询所有账号
   * @param params
   */
  static async queryAll(params: { pageSize: number; pageNum: number } = { pageSize: 1000, pageNum: 1 }) {
    const { pageNum, pageSize } = params
    let offset = (pageNum - 1) * pageSize
    offset = offset > 0 ? offset : 0

    const list = await Knex(this.TABLE_NAME)
      .select('id', 'email', 'name', 'create_time')
      .catch(this.dbSelectErrorHandler)

    return list
  }
}

export default Account
