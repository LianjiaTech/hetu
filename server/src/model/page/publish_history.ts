import Base from '~/src/model/base'
import Knex from '~/src/library/mysql'
import moment from 'moment'
import _ from 'lodash'

export type TypeHistoryRecord = {
  id?: number
  env?: string
  page_draft_id?: number
  page_id?: number
  release_note?: string
  create_at?: number
  update_at?: number
  create_ucid?: string
  create_user_name?: string
  update_ucid?: string
  update_user_name?: string
}

class PublishHistory extends Base {
  static MAX_ITEM = 30

  static TABLE_NAME = 'page_publish_history'
  static TABLE_COLUMN = [
    `id`,
    `env`,
    `page_id`,
    `page_draft_id`,
    `release_note`,
    `create_at`,
    `update_at`,
    `create_ucid`,
    `create_user_name`,
    `update_ucid`,
    `update_user_name`,
  ]

  static async asyncGetPublishDraftId(env: string, pageId: number) {
    let result = await Knex.queryBuilder()
      .select(this.TABLE_COLUMN)
      .from(this.TABLE_NAME)
      .where('env', '=', env)
      .andWhere('page_id', '=', pageId)
      .orderBy('id', 'desc') // 取最新的一条
      .catch(this.dbSelectErrorHandler)
    let pageDraftId: number = _.get(result, [0, 'page_draft_id'], 0)
    return pageDraftId
  }

  static async asyncCreatePublishHistory(
    env: string,
    page_id: number,
    page_draft_id: number,
    release_note: string,
    create_ucid: string,
    create_user_name: string,
  ) {
    let now = moment().unix()
    let affectRowCountList = await Knex.queryBuilder()
      .insert({
        env,
        page_id,
        page_draft_id,
        release_note,
        create_at: now,
        create_ucid,
        create_user_name,
        update_at: now,
        update_ucid: create_ucid,
        update_user_name: create_user_name,
      })
      .into(this.TABLE_NAME)
      .catch(this.dbInsertErrorHandler)
    let insertId = _.get(affectRowCountList, [0], 0)
    return insertId
  }

  static async asyncGetPublishHistory(page_id: number, env: string): Promise<Array<TypeHistoryRecord>> {
    let historyList = await Knex.queryBuilder()
      .select(this.TABLE_COLUMN)
      .from(this.TABLE_NAME)
      .where('env', '=', env)
      .andWhere('page_id', '=', page_id)
      .orderBy('id', 'desc')
      // 最多展示30条
      .limit(this.MAX_ITEM)
      .catch(this.dbSelectErrorHandler)
    return historyList
  }

  static async asyncDeleteByPageId(pageId: number) {
    let affectRowCount = await Knex.queryBuilder()
      .delete()
      .from(this.TABLE_NAME)
      .where('page_id', '=', pageId)
      .catch(this.dbDeleteErrorHandler)
    return affectRowCount
  }
}

export default PublishHistory
