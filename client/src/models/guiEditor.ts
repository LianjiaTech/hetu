import { EffectsCommandMap, Model } from 'dva'
import { set, get, isPlainObject, isArray } from 'lodash'
import { changeIframePageConfig, formatUrl } from '~/utils/utils'
import { post as axiosPost, get as axiosGet } from '~/utils/request'

import localHistory from '~/utils/localHistory'

import queryString from 'query-string'

import { guiEditorState } from '../types/models/guiEditor'
import { action } from '../types/models/global'

// 创建页面
const createPage = (params: dynamicObject) => {
  let querys = location.search.replace('?', '').split('&')
  let query: dynamicObject = {}
  querys.map((v) => {
    let d = v.split('=')
    query[d[0]] = d[1]
  })
  query['id'] && (params['projectId'] = query['id'])
  return axiosPost('/api/page/record/create', params)
}

// 更新页面配置
const updatePageConfig = (params: any) => {
  return axiosPost('/api/page/draft/save', params)
}

// 获取页面配置
const getPageConfig = (params: any) => {
  return axiosGet('/api/page/draft/get', params)
}

// 切换iframe loading状态
const toggleIframeLoading = (v: boolean, put: Function) => {
  return put({
    type: 'setState',
    payload: {
      isIframeLoading: !!v,
    },
  })
}

let project = null

export default {
  namespace: 'guiEditor',

  state: {
    // iframe 查询参数
    query: null,
    // 页面id
    pageId: null,
    // 草稿id
    draftId: null,
    // 项目id
    project: null,
    // 页面配置
    pageConfig: null,
    // 编译结果
    pagestate: null,
    // 页面模式
    hoverComponentData: null,
    selectedComponentData: null,
    isIframeLoading: false,
    // 是否展示占位符元素(用于添加组件)
    isInsertItemMode: false,
    // 是否处于拖拽状态
    isDragging: false,
    // 右侧激活面板,默认为可视化编辑器
    activeTab: 'base',
    // 是否锁屏
    isLockIframe: true,
  } as guiEditorState,

  effects: {
    /**
     * 插入新组件, 显示占位组件, 开始选择需要插入的组件
     */
    *startInsertItemMode({ payload }: action, { call, put }: EffectsCommandMap) {
      yield put({
        type: 'setState',
        payload: {
          isInsertItemMode: true,
        },
      })
    },
    /**
     * 组件插入完毕, 隐藏占位组件
     */
    *finishInsertItemMode({}, { call, put }: EffectsCommandMap) {
      yield put({
        type: 'setState',
        payload: {
          isInsertItemMode: false,
        },
      })
    },
    // 更新页面配置, 更新iframe
    *updatePageConfigAndIframe({ payload }: action, { call, put }: EffectsCommandMap) {
      try {
        yield toggleIframeLoading(true, put)
        const { key, value, pageConfig } = payload
        let result = value
        if (key) {
          result = set(pageConfig, key, result)
        }

        let { route, query } = queryString.parse(window.location.search)

        if (result.route !== route) {
          let searchStr = queryString.stringify({ route: result.route, query })
          window.location.href = window.location.pathname + '?' + searchStr
          return false
        }

        result = JSON.parse(JSON.stringify(result))
        yield call(changeIframePageConfig, result)

        yield put({
          type: 'setState',
          payload: {
            pageConfig: result,
          },
        })
        return
      } catch (e) {
        throw e
      } finally {
        yield toggleIframeLoading(false, put)
      }
    },
    // 获取页面配置
    *getPageConfig({ payload }: action, { call, put }: EffectsCommandMap) {
      try {
        yield toggleIframeLoading(true, put)
        const res = yield call(getPageConfig, payload)
        if (get(res, 'data.draft.content')) {
          let pageConfig = JSON.parse(get(res, 'data.draft.content'))
          let pageId = get(res, 'data.page.id')
          let draftId = get(res, 'data.draft.id')
          project = get(res, 'data.page.project_id')

          localHistory.init({ pageId })

          localHistory.push(pageConfig)

          yield put({
            type: 'setState',
            payload: {
              pageConfig,
              pageId,
              draftId,
              project,
            },
          })
          return pageConfig
        }
        throw TypeError('接口返回值格式错误' + JSON.stringify(res, null, 2))
      } catch (e) {
        throw e
      } finally {
        yield toggleIframeLoading(false, put)
      }
    },
    // 新建页面
    *createPage({ payload }: action, { call, put }: EffectsCommandMap) {
      try {
        if (isPlainObject(payload) && isPlainObject(payload.pageConfig)) {
          let path = get(payload, 'pageConfig.route')
          let name = get(payload, 'pageConfig.title')
          const content = JSON.stringify(payload.pageConfig)

          const { id = -1 } = queryString.parse(window.location.search)

          const res = yield call(createPage, { path, name, content, projectId: id })
          return res
        }
        throw new TypeError('payload must be an plain object')
      } catch (e) {
        throw e
      } finally {
        yield toggleIframeLoading(false, put)
      }
    },
    // 更新页面
    *updatePage({ payload }: action, { call, put }: EffectsCommandMap) {
      try {
        yield toggleIframeLoading(true, put)
        const { projectId, pageId, pageConfig } = payload

        if (!projectId) {
          throw new TypeError('缺少项目id')
        }
        if (!pageId) {
          throw new TypeError('缺少页面id')
        }
        if (isPlainObject(pageConfig)) {
          const json = JSON.stringify(pageConfig)
          const res = yield call(updatePageConfig, { projectId, pageId, content: json })

          localHistory.push(pageConfig)

          const draftId = get(res, 'data.draftId')

          yield put({
            type: 'setState',
            payload: {
              pageConfig,
              pageId,
              draftId,
            },
          })
          return res
        }
        throw new TypeError('pageConfig 格式错误')
      } catch (e) {
        throw e
      } finally {
        yield toggleIframeLoading(false, put)
      }
    },
    // 发布配置到某环境
    *publish({ payload }: action, { call, put }: EffectsCommandMap) {
      try {
        const res = yield call(axiosPost, '/api/page/draft/publish', payload)
      } catch (e) {
        throw e
      }
    },
  },

  reducers: {
    setState(state: guiEditorState, { payload }: action) {
      if (!isPlainObject(payload)) {
        throw new TypeError('payload must be an plain object')
      }
      return {
        ...state,
        ...payload,
      }
    },
  },

  subscriptions: {},
} as Model
