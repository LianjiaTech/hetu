import _ from 'lodash'
import Knex from '~/src/library/mysql'

class Util {
  /**
   * 延迟执行函数, 返回一个 Promise
   * @param {number} ms
   */
  static asyncSleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * 带默认值的parseInt
   * @param {*} string
   * @param {*} defaultValue
   */
  static parseIntWithDefault(string: string, defaultValue = 0) {
    let result = parseInt(string)
    if (_.isNaN(result)) {
      return defaultValue
    }
    return result
  }

  static async getTotalPage(projects: any[], total: number = 0) {
    if (!_.isArray(projects)) {
      return { projects: [], total }
    }
    // 统计页面的总数量
    for (let i = 0; i < projects.length; i++) {
      let project = projects[i]
      const records = await Knex('page_record').where('project_id', project.id)

      if (_.isArray(records)) {
        // 当前项目的页面总量
        project.pagesTotal = records.length
        total += records.length
      }
      delete project.layout
    }

    return { total, projects }
  }

  /**
   * 带默认值的parseFloat
   * @param {*} string
   * @param {*} defaultValue
   */
  static parseFloatWithDefault(string: string, defaultValue = 0) {
    let result = parseFloat(string)
    if (_.isNaN(result)) {
      return defaultValue
    }
    return result
  }

  static parseJSONWithDefault(str: string = '', defaultValue = {}) {
    try {
      return JSON.parse(str)
    } catch (e) {
      return defaultValue
    }
  }

  /**
   * 空字符串处理
   */
  static transformEmptyString(params: object) {
    if (_.isPlainObject(params)) {
      let result: any = {}
      for (let key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          // @ts-ignore
          let value = params[key]
          if (value !== '') {
            result[key] = value
          }
          continue
        }
      }
      return result
    }
    return params
  }
}

export function versionCompare(version1: string, operater: string, version2: string): boolean {
  if (version1[0].toLowerCase() === 'v') version1 = version1.substr(1)
  if (version2[0].toLowerCase() === 'v') version2 = version2.substr(1)

  const _version1 = version1.split('.').map((number: any) => number | 0)
  const _version2 = version2.split('.').map((number: any) => number | 0)

  const length = Math.max(_version1.length, _version2.length)

  let result = '='
  for (let index = 0; index < length; index++) {
    const value1 = _version1[index] | 0
    const value2 = _version2[index] | 0
    const _value = value1 - value2
    if (_value !== 0) {
      result = _value > 0 ? '>' : '<'
      break
    }
  }

  return operater.indexOf(result) !== -1
}

export default Util
