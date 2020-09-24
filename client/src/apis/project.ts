import _ from 'lodash'
import request from '~/utils/request'
import { transformPath } from '~/utils/apis'

export default class Project {
  /**
   * 根据页面路由获取项目详情
   * @param path 页面路由
   */
  static async getAsyncProjectDetail(path = '/') {
    let projectDetail

    let res = await request.get('/api/v2/hetu/project/detail', {
      path: transformPath(path),
    })
    projectDetail = _.get(res, 'data')

    if (!_.get(projectDetail, 'id')) {
      throw new Error('项目不存在')
    }

    return projectDetail
  }

  /**
   * 根据项目id, 获取项目详情
   * @param projectId 项目id
   */
  static async getAsyncProjectDetailById(projectId: number) {
    // 然后通过接口获取
    let res = await request.get('/api/v2/hetu/project/detail', {
      id: projectId,
    })
    let projectDetail = _.get(res, 'data')

    if (!_.get(projectDetail, 'id')) {
      throw new Error('项目不存在')
    }

    return projectDetail
  }

  /**
   * 获取项目列表
   */
  static async getAsyncProjectList() {
    let res = await request.get('/api/v4/hetu/project/list', { pageSize: 1000 })

    if (!_.isArray(_.get(res, 'data.list'))) {
      throw new TypeError('获取项目列表失败')
    }

    return res.data.list
  }

  /**
   * 获取菜单栏数据
   * @param url
   */
  static async getAsyncMenuData(url: string) {
    return request.get(url).then((res) => {
      if (_.isArray(res.data)) {
        return Promise.resolve(res.data)
      }
    })
  }
}
