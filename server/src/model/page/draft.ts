import Base from '~/src/model/base'
import Knex from '~/src/library/mysql'
import TypeKnex from 'knex'
import _ from 'lodash'
import moment from 'moment'

export type TypeDraftRecord = {
  id?: number
  page_id?: number
  content?: string
  is_publish?: 0 | 1
  create_at?: number
  update_at?: number
  create_ucid?: string
  create_user_name?: string
  update_ucid?: string
  update_user_name?: string
}

class Draft extends Base {
  static TABLE_NAME = 'page_draft'
  static TABLE_COLUMN = [
    `id`,
    `page_id`,
    `content`,
    `is_publish`,
    `create_at`,
    `update_at`,
    `create_ucid`,
    `create_user_name`,
    `update_ucid`,
    `update_user_name`,
  ]

  static async asyncGet(id: number) {
    let rawRecordList = await Knex.queryBuilder()
      .select(this.TABLE_COLUMN)
      .from(this.TABLE_NAME)
      .where('id', '=', id)
      .catch(this.dbSelectErrorHandler)
    let record = _.get(rawRecordList, [0], {}) as TypeDraftRecord
    return record
  }

  /**
   * draftId为空时, 取隶属于pageId最近一条草稿
   * 传入draftId时, 取隶属于pageId的draftId对应的草稿, 没有取到则返回空对象
   * @param pageId
   * @param draftId
   */
  static async asyncGetByPageId(pageId: number, draftId?: number) {
    let rawRecordList = await Knex.queryBuilder()
      .select(this.TABLE_COLUMN)
      .from(this.TABLE_NAME)
      .where('page_id', '=', pageId)
      .where((queryBuilder: TypeKnex.QueryBuilder) => {
        if (draftId !== undefined) {
          queryBuilder.where('id', '=', draftId)
        }
      })
      .orderBy('id', 'desc')
      .catch(this.dbSelectErrorHandler)
    let record = _.get(rawRecordList, [0], {}) as TypeDraftRecord
    return record
  }

  static async asyncCreate(page_id: number, content: string, create_ucid: string, create_user_name: string) {
    let now = moment().unix()
    let affectRowCountList = await Knex.queryBuilder()
      .insert({
        page_id,
        content,
        create_at: now,
        create_ucid,
        create_user_name,
        update_at: now,
        update_ucid: create_ucid,
        update_user_name: create_user_name
      })
      .into(this.TABLE_NAME)
      .catch(this.dbInsertErrorHandler)
    let insertId: number = _.get(affectRowCountList, [0], 0)
    return insertId
  }

  /**
   * 将记录标记为已发布
   * @param draftId
   * @param update_ucid
   * @param update_user_name
   */
  static async asyncMarkedAsPublish(draftId: number, update_ucid: string, update_user_name: string) {
    let affectRowCount = await this.asyncUpdate(draftId, update_ucid, update_user_name, {
      is_publish: 1,
    })
    return affectRowCount
  }

  static async asyncUpdate(draftId: number, update_ucid: string, update_user_name: string, data: TypeDraftRecord) {
    let affectRowCount: number = await Knex.queryBuilder()
      .update({
        ...data,
        update_at: moment().unix(),
        update_ucid,
        update_user_name,
      })
      .from(this.TABLE_NAME)
      .where('id', '=', draftId)
      .catch(this.dbUpdateErrorHandler)
    return affectRowCount
  }

  static async asyncDeleteByPageId(pageId: number) {
    let affectRowCount = await Knex.queryBuilder()
      .delete()
      .from(this.TABLE_NAME)
      .where('page_id', '=', pageId)
      .catch(this.dbDeleteErrorHandler)
    return affectRowCount
  }

  /**
   * 删除一天之前的所有未发布的草稿
   * @param pageId
   */
  static async asyncClearUnPublishDraft_1DayAgo(pageId: number) {
    let affectRowCount = await Knex.queryBuilder()
      .delete()
      .from(this.TABLE_NAME)
      .where('page_id', '=', pageId)
      .where('is_publish', '=', 0)
      .where('create_at', '<=', moment().unix() - 86400)
      .catch(this.dbDeleteErrorHandler)
    return affectRowCount
  }
}

export default Draft
