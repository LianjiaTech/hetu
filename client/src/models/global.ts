import { EffectsCommandMap, Model } from 'dva'
import _ from 'lodash'
import Api from '~/apis'
import { post as axiosPost, get as axiosGet } from '~/utils/request'

import { IGlobalState, action, IPaneItem } from '../types/models/global'

const feedbackSubmit = (params: dynamicObject) => {
  return axiosPost('/api/hetu/feedback/add', params)
}

export default {
  namespace: 'global',

  state: {
    // 项目列表
    projectList: null,
    // 项目详情
    projectDetail: null,
    // 页面配置
    pageConfig: null,
    // 用户信息
    userInfo: null,
    // 页面是否初始化
    isPageInit: false,
    // 菜单栏数据
    menuData: null,
    // 项目id
    projectId: null,
    // 草稿Id
    draftId: null,
    // 创建人Id
    createUcid: null,
    // 是否为本地页面
    isLocalPage: false,
    // 面包屑
    panes: [],
    // 激活的面包屑
    activePanekey: '',
  } as IGlobalState,

  effects: {
    // 获取用户信息
    *getAsyncUserInfo({}, { put, call }: EffectsCommandMap) {
      const userInfo = yield call(Api.User.getAsyncUserInfo)
      if (!_.get(userInfo, 'id')) {
        return Promise.reject('getAsyncUserInfo 响应格式错误:' + JSON.stringify(userInfo))
      }

      yield put({
        type: 'setState',
        payload: { userInfo },
      })

      return Promise.resolve(userInfo)
    },

    // 获取项目列表
    *getAsyncProjectList({}, { call, put }: EffectsCommandMap) {
      const projectList = yield call(Api.Project.getAsyncProjectList)

      yield put({
        type: 'setState',
        payload: { projectList },
      })

      return Promise.resolve(projectList)
    },

    // 通过page path获取项目详情
    *getAsyncProjectDetail(
      { payload }: action<{ pathname: string }>,
      { put, call }: EffectsCommandMap,
    ) {
      const pathname = _.get(payload, 'pathname')
      if (!pathname) {
        throw new TypeError('getAsyncProjectDetail 必须传递pathname 参数 ')
      }
      const projectDetail = yield call(Api.Project.getAsyncProjectDetail, pathname)

      yield put({
        type: 'setState',
        payload: { projectDetail },
      })

      return Promise.resolve(projectDetail)
    },

    // 根据project id获取项目详情
    *getAsyncProjectDetailById(
      { payload }: action<{ projectId: number | string }>,
      { put, call }: EffectsCommandMap,
    ) {
      const projectId = _.get(payload, 'projectId')
      if (!projectId) {
        throw new TypeError('getAsyncProjectDetailById 必须传递projectId参数 ')
      }
      const projectDetail = yield call(Api.Project.getAsyncProjectDetailById, projectId)

      yield put({
        type: 'setState',
        payload: { projectDetail },
      })

      return Promise.resolve(projectDetail)
    },

    // 获取页面详情
    *getAsyncPageDetail(
      { payload }: action<{ pathname: string }>,
      { put, call }: EffectsCommandMap,
    ) {
      const pathname = _.get(payload, 'pathname')
      if (!pathname) {
        throw new TypeError('getAsyncPageDetail 必须传递pathname 参数 ')
      }
      const result = yield call(Api.Page.getAsyncPageDetail, pathname)

      if (!_.get(result, 'pageConfig.route')) {
        throw new TypeError('getAsyncPageDetail 响应格式错误:' + JSON.stringify(result.pageConfig))
      }

      yield put({
        type: 'setState',
        payload: result,
      })

      return Promise.resolve(result)
    },

    // 获取菜单详情
    *getAsyncMenuData(
      { payload }: action<{ config: dynamicObject }>,
      { put, call }: EffectsCommandMap,
    ) {
      let menuData = []
      let config = _.get(payload, 'config')

      // 如果为数组
      if (_.isArray(config)) {
        menuData = config
      }

      let urlReg = /^(https?:\/\/)?(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
      // 如果为url
      if (_.isString(config) && urlReg.test(config)) {
        menuData = yield call(Api.Project.getAsyncMenuData, config)

        if (!_.isArray(menuData)) {
          throw new TypeError('getAsyncMenuData 请求响应值不合法:' + menuData)
        }
      }

      yield put({
        type: 'setState',
        payload: {
          menuData,
        },
      })

      return Promise.resolve(menuData)
    },
    *feedbackSubmit({ payload }: action, { call, put }: EffectsCommandMap) {
      const res = yield call(feedbackSubmit, {
        ...payload,
      })
      yield put({
        type: 'setState',
        payload: { res },
      })
      return res
    },
  },

  reducers: {
    setState(state: IGlobalState, { payload }: action) {
      if (!_.isPlainObject(payload)) {
        throw new TypeError(`payload:${payload} must be an plain object`)
      }
      return {
        ...state,
        ...payload,
      }
    },
    addPane(state: IGlobalState, { payload }: action<IPaneItem>) {
      if (!isPaneItem(payload)) {
        throw new TypeError(`payload:${payload} is not an IPaneItem`)
      }
      const isExist = state.panes.some((v) => v.key === payload.key)
      if (isExist) return state

      return {
        ...state,
        panes: [...state.panes, payload],
      }
    },
  },

  subscriptions: {},
} as Model

function isPaneItem(obj: any) {
  if (_.isPlainObject(obj)) {
    const { key, title, closable, content } = obj
    if (_.isString(key) && _.isString(title) && _.isBoolean(closable)) {
      return true
    }
  }

  return false
}
