import _ from 'lodash'
import queryString from 'query-string'
import request from '~/utils/request'
import { isPageConfig } from '~/utils/valid'
import { transformPath } from '~/utils/apis'

interface IPageCache {
  [path: string]: any
}

export default class Page {
  // 页面缓存
  static pageCache: IPageCache = {}

  /**
   * 根据路由获取页面详情
   * @param path 页面路由
   * @param draftId 草稿id
   */
  static async getAsyncPageDetailByRoute(path: string, draftId: string | number) {
    let cacheKey = path + draftId
    if (this.pageCache[cacheKey]) {
      return this.pageCache[cacheKey]
    }
    const res = await request.get('/api/page/record/get', {
      path: transformPath(path),
      draftId,
    })
    this.pageCache[cacheKey] = res
    return res
  }

  /**
   * 获取页面详情
   * 根据浏览器中的查询参数pathname
   */
  static async getAsyncPageDetail() {
    const { pathname = '/', search } = window.location
    const query = queryString.parse(search)
    // 首先从本地获取页面配置
    let pageConfig = null
    let { draftId } = query
    // 然后调接口获取
    let res = await this.getAsyncPageDetailByRoute(pathname, draftId as string)

    let content = _.get(res, 'data.draft.content')
    let projectId = _.get(res, 'data.page.project_id')
    let createUcid = +_.get(res, 'data.page.create_ucid')

    if (content) {
      try {
        pageConfig = JSON.parse(content)
      } catch (e) {
        throw e
      }
    }

    if (!isPageConfig(pageConfig)) {
      console.error('pageConfig', pageConfig)
      throw new Error(`路径${pathname}对应的页面配置格式错误`)
    }

    return { pageConfig, projectId, draftId, createUcid, isLocalPage: false }
  }

  /**
   * 创建页面
   * @param params
   */
  static async createAsyncPage(params: dynamicObject) {
    return request.post('/api/page/record/create', params)
  }
}
