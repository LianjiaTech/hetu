import _ from 'lodash'
import request from '~/utils/request'

export default class User {
  /**
   * 获取用户信息
   */
  static async getAsyncUserInfo() {
    return request.get('/api/hetu/info').then((res) => {
      if (_.isPlainObject(_.get(res, 'data'))) {
        return Promise.resolve(res.data)
      }
      return Promise.reject('getAsyncUserInfo 返回值格式错误')
    })
  }
}
