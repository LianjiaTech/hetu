import Base from '~/src/model/base'
import Knex from '~/src/library/mysql'
import _ from 'lodash'

export type Department = {
  id: string
  name: string
  order: number
}

class Project extends Base {
  // @todo(yaozeyuan) 临时测试先用project_new, 上线前记得把名字换回来
  static TABLE_NAME = 'department'
  static TABLE_COLUMN = [`id`, `name`, `order`]

  // 创建/更新 必传字段
  static requiredFields = ['name', 'project_code', 'proxy_host']

  static async asyncGet(id: number) {
    let department: Department[] = await Knex.queryBuilder()
      .select('*')
      .from(this.TABLE_NAME)
      .where('id', id)
      .first()

    return department
  }

  static async asyncGetAll() {
    let departments: Department[] = await Knex.queryBuilder()
      .select('*')
      .from(this.TABLE_NAME)
      .orderBy('order', 'desc')

    return departments
  }
}

export default Project
