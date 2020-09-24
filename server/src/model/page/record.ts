import Base from '~/src/model/base'
import Knex from '~/src/library/mysql'
import TypeKnex from 'knex'
import moment from 'moment'
import _ from 'lodash'

export type TypePageRecord = {
  id?: number
  path?: string
  name?: string
  project_id?: number
  create_at?: number
  update_at?: number
  create_ucid?: string
  create_user_name?: string
  update_ucid?: string
  update_user_name?: string
}

class Record extends Base {
  static TABLE_NAME = 'page_record'
  static TABLE_COLUMN = [
    `id`,
    `path`,
    `name`,
    `project_id`,
    `create_at`,
    `update_at`,
    `create_ucid`,
    `create_user_name`,
    `update_ucid`,
    `update_user_name`,
  ]

  static async asyncGetId(path: string) {
    let result: Array<TypePageRecord> = await Knex.queryBuilder()
      .select(this.TABLE_COLUMN)
      .from(this.TABLE_NAME)
      .where('path', '=', path)
      .catch(this.dbSelectErrorHandler)
    let id: number = _.get(result, [0, 'id'], 0)
    return id
  }

  static async asyncGet(id: number): Promise<TypePageRecord> {
    let result: Array<TypePageRecord> = await Knex.queryBuilder()
      .select(this.TABLE_COLUMN)
      .from(this.TABLE_NAME)
      .where('id', '=', id)
      .catch(this.dbSelectErrorHandler)
    let record = _.get(result, [0], {}) as TypePageRecord
    return record
  }

  /**
   * 获取页面总数(支持搜索)
   * @param projectId
   * @param searchOption
   */
  static async asyncGetListCount(
    projectId: number,
    searchOption: {
      name?: string
      path?: string
      createAt?: number
      createUcid?: string
    },
  ) {
    let whereParams = { project_id: projectId }
    let { name, path, createAt, createUcid } = searchOption

    let recordList: Array<TypePageRecord> = await Knex.queryBuilder()
      .count(`id as totalCount`)
      .from(this.TABLE_NAME)
      .where((builder: TypeKnex.QueryBuilder) => {
        builder.where('project_id', '=', projectId)
        if (_.isUndefined(name) === false) {
          builder.where('name', 'like', `%${name}%`)
        }
        if (_.isUndefined(path) === false) {
          builder.where('path', 'like', `%${path}%`)
        }
        if (_.isUndefined(createAt) === false) {
          builder.where('create_at', '>', `${createAt}`)
        }
        if (_.isUndefined(createUcid) === false) {
          builder.where('create_ucid', '=', `%${createUcid}%`)
        }
      })
      .catch(this.dbSelectErrorHandler)
    let sql = await Knex.queryBuilder().count(`id as totalCount`).from(this.TABLE_NAME).where(whereParams).toString()
    let totalCount: number = _.get(recordList, [0, 'totalCount'], 0)
    return totalCount
  }

  /**
   * 适配旧页面列表接口
   */
  static async asyncAdaptForOldPageListRequest(
    pageNum: number,
    pageSize: number,
    searchOption: {
      id?: number
      projectId?: number
      name?: string
      path?: string
      createUcid?: string
      createUserName?: string
      order?: string
      desc?: string
    } = {},
  ) {
    let { id, name, path, createUcid, projectId, createUserName, order = 'id', desc } = searchOption
    let recordList: Array<TypePageRecord> = await Knex.queryBuilder()
      .select(this.TABLE_COLUMN)
      .from(this.TABLE_NAME)
      .where((builder: TypeKnex.QueryBuilder) => {
        if (_.isUndefined(id) === false) {
          // @ts-ignore
          builder.where('id', '=', id)
        }
        if (_.isUndefined(projectId) === false) {
          // @ts-ignore
          if (projectId !== 'all') {
            // @ts-ignore
            builder.where('project_id', '=', projectId)
          }
        }
        if (_.isUndefined(name) === false) {
          builder.where('name', 'like', `%${name}%`)
        }
        if (_.isUndefined(path) === false) {
          builder.where('path', 'like', `%${path}%`)
        }
        if (_.isUndefined(createUcid) === false) {
          builder.where('create_ucid', '=', `%${createUcid}%`)
        }
        if (_.isUndefined(createUserName) === false) {
          builder.where('create_user_name', '=', `%${createUserName}%`)
        }
      })
      .orderBy(order, desc)
      .offset((pageNum - 1) * pageSize)
      .limit(pageSize)
      .catch(this.dbSelectErrorHandler)
    return recordList
  }
  /**
   * 适配旧页面列表接口
   */
  static async asyncAdaptForOldPageListCountRequest(
    searchOption: {
      id?: number
      projectId?: number
      name?: string
      path?: string
      createUcid?: string
      createUserName?: string
      order?: string
      desc?: string
    } = {},
  ) {
    let { id, name, path, createUcid, projectId, createUserName, order, desc } = searchOption
    let recordList: Array<TypePageRecord> = await Knex.queryBuilder()
      .select('count(*) as total')
      .from(this.TABLE_NAME)
      .where((builder: TypeKnex.QueryBuilder) => {
        if (_.isUndefined(id) === false) {
          // @ts-ignore
          builder.where('id', '=', id)
        }
        if (_.isUndefined(projectId) === false) {
          // @ts-ignore
          if (projectId !== 'all') {
            // @ts-ignore
            builder.where('project_id', '=', projectId)
          }
        }
        if (_.isUndefined(name) === false) {
          builder.where('name', 'like', `%${name}%`)
        }
        if (_.isUndefined(path) === false) {
          builder.where('path', 'like', `%${path}%`)
        }
        if (_.isUndefined(createUcid) === false) {
          builder.where('create_ucid', '=', `%${createUcid}%`)
        }
        if (_.isUndefined(createUserName) === false) {
          builder.where('create_user_name', '=', `%${createUserName}%`)
        }
      })
      .catch(this.dbSelectErrorHandler)
    let total = _.get(recordList, [0], 'total')
    return total
  }

  /**
   * 获取页面列表(支持搜索)
   * @param projectId
   * @param pageNum
   * @param pageSize
   * @param searchOption
   */
  static async asyncGetList(
    projectId: number,
    pageNum: number,
    pageSize: number,
    searchOption: {
      name?: string
      path?: string
      createUcid?: string
    } = {},
  ): Promise<Array<TypePageRecord>> {
    let { name, path, createUcid } = searchOption
    let offset = (pageNum - 1) * pageSize
    if (offset <= 0) {
      offset = 0
    }
    let recordList: Array<TypePageRecord> = await Knex.queryBuilder()
      .select(this.TABLE_COLUMN)
      .from(this.TABLE_NAME)
      .where((builder: TypeKnex.QueryBuilder) => {
        builder.where('project_id', '=', projectId)
        if (_.isUndefined(name) === false) {
          builder.where('name', 'like', `%${name}%`)
        }
        if (_.isUndefined(path) === false) {
          builder.where('path', 'like', `%${path}%`)
        }
        if (_.isUndefined(createUcid) === false) {
          builder.where('create_ucid', '=', `%${createUcid}%`)
        }
      })
      .orderBy('id', 'desc')
      .offset(offset)
      .limit(pageSize)
      .catch(this.dbSelectErrorHandler)
    return recordList
  }

  static async asyncCreate(
    path: string,
    name: string,
    project_id: number,
    create_ucid: string,
    create_user_name: string,
  ) {
    let now = moment().unix()
    let affectRowCountList = await Knex.queryBuilder()
      .insert({
        path,
        name,
        project_id,
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

  static async asyncUpdate(page_id: number, data: TypePageRecord, update_ucid: string, update_user_name: string) {
    let { name, path, project_id } = data
    let updateData: TypePageRecord = {}
    if (path !== undefined) {
      updateData['path'] = path
    }
    if (name !== undefined) {
      updateData['name'] = name
    }
    if (project_id !== undefined) {
      updateData['project_id'] = project_id
    }
    let affectRowCount = await Knex.queryBuilder()
      .update({
        ...updateData,
        update_at: moment().unix(),
        update_ucid,
        update_user_name,
      })
      .from(this.TABLE_NAME)
      .where('id', '=', page_id)
      .catch(this.dbUpdateErrorHandler)
    return affectRowCount
  }

  static async asyncDelete(pageId: number) {
    let affectRowCount = await Knex.queryBuilder()
      .delete()
      .from(this.TABLE_NAME)
      .where('id', '=', pageId)
      .catch(this.dbDeleteErrorHandler)
    return affectRowCount
  }
}

export default Record
