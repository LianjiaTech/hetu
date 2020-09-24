import Base from '~/src/model/base'
import Knex from '~/src/library/mysql'
import moment from 'moment'
import _ from 'lodash'

export type TypeSubmodule = {
  id: number
  submodule: string
  department: string
  owner: number
  doc?: string
  desc: number
  update_at?: number
  create_ucid?: string
  create_user_name?: string
  update_ucid?: string
  update_user_name?: string
}

class Submodule extends Base {
  static TABLE_NAME = 'submodule'

  static TABLE_COLUMN = [
    `id`,
    `submodule`,
    `department`,
    `owner`,
    `desc`,
    `doc`,
    `update_at`,
    `create_ucid`,
    `create_user_name`,
    `update_ucid`,
    `update_user_name`,
  ]

  /**
   * 获取页面列表(支持搜索)
   * @param projectId
   * @param pageNum
   * @param pageSize
   * @param searchOption
   */
  static async asyncGetList(pageNum: number, pageSize: number): Promise<Array<TypeSubmodule>> {
    let offset = (pageNum - 1) * pageSize
    if (offset <= 0) {
      offset = 0
    }
    let submoduleList: Array<TypeSubmodule> = await Knex(this.TABLE_NAME)
      .join('department', `submodule.department`, 'department.id')
      .select(
        `submodule.id as id`,
        `submodule.submodule as submodule`,
        `submodule.department as department`,
        `submodule.owner as owner`,
        `submodule.desc as desc`,
        `submodule.doc as doc`,
        'department.name as departmentName',
      )
      .orderBy('id', 'desc')
      .offset(offset)
      .limit(pageSize)
      .catch(this.dbSelectErrorHandler)
    return submoduleList
  }

  static async asyncCreate(
    submodule: string,
    department: number,
    owner: string,
    desc: string,
    doc: string,
    create_ucid: string,
    create_user_name: string,
  ) {
    let now = moment().unix()
    let affectRowCountList = await Knex.queryBuilder()
      .insert({
        submodule,
        department,
        owner,
        desc,
        doc,
        create_at: now,
        create_ucid,
        create_user_name,
        update_at: now,
        update_ucid: create_ucid,
        update_user_name: create_user_name,
      })
      .into(this.TABLE_NAME)
      .catch(this.dbInsertErrorHandler)
    let insertId: number = _.get(affectRowCountList, [0], 0)
    return insertId
  }

  static async asyncUpdate(id: number, data: TypeSubmodule) {
    let now = moment().unix()
    let affectRowCount: number = await Knex.queryBuilder()
      .update({
        ...data,
        update_at: now,
      })
      .from(this.TABLE_NAME)
      .where('id', '=', id)
      .catch(this.dbUpdateErrorHandler)
    return affectRowCount
  }

  static async asyncDelete(submoduleId: number) {
    let affectRowCount = await Knex.queryBuilder()
      .delete()
      .from(this.TABLE_NAME)
      .where('id', '=', submoduleId)
      .catch(this.dbDeleteErrorHandler)
    return affectRowCount
  }
}

export default Submodule
