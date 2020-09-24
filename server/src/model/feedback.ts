import Base from '~/src/model/base'
import Knex from '~/src/library/mysql'
import _ from 'lodash'
import moment from 'moment'

export type TypeFeedback = {
  id?: number
  type?: string
  remark?: string
  score?: number
  create_ucid?: string
  create_user_name?: string
  create_at?: string
}

class Feedback extends Base {
  static TABLE_NAME = 'feedback'

  static TABLE_COLUMN = [`id`, `type`, `remark`, `score`, `create_ucid`, `create_user_name`, `create_at`]

  /**
   * 获取页面列表(支持搜索)
   * @param pageNum
   * @param pageSize
   */

  static async asyncGetList({ type, pageSize, pageNum }: { type?: string; pageSize: number; pageNum: number }) {
    let offset = (pageNum - 1) * pageSize
    offset = offset > 0 ? offset : 0

    const query = Knex('feedback')
      .select(
        '*',
        'feedback.id as id',
        'feedback.type as type',
        'feedback.remark as remark',
        'feedback.score as score',
        'feedback.create_ucid as create_ucid',
        'feedback.create_user_name as create_user_name',
        'feedback.create_at as create_at',
      )
      .orderBy('id', 'desc')
      .limit(pageSize)
      .offset(offset)

    let results = []
    if (type) {
      results = await query.where('type', type)
    } else {
      results = await query
    }
    const total = results.length
    return { results, total }
  }

  static async asyncCreate(
    type: string,
    remark: string,
    score: number,
    create_ucid: string,
    create_user_name: string,
  ) {
    let now = moment().format()
    const result = await Knex.queryBuilder()
      .insert({
        type,
        remark,
        score,
        create_ucid,
        create_user_name,
        create_at: now,
      })
      .into('feedback')
      .catch(this.dbInsertErrorHandler)
    let insertId: number = _.get(result, [0], 0)
    return insertId
  }

  static async asyncDelete(id: number) {
    const result = await Knex.queryBuilder()
      .delete()
      .from('feedback')
      .where('id', '=', id)
      .catch(this.dbDeleteErrorHandler)

    return result
  }
}

export default Feedback
