import { AnyAction } from 'redux'

export interface action<T = dynamicObject> extends AnyAction {
  payload: T
}

export type IProjectDetail = {
  id: 0
  name: string
  project_code: string
  description: string
  home: string
  logo: string
  env: {}
  proxy_success_code: 0
  create_user_name: string
  groupIds: []
  layout: { type: 'blank' }
  proxy_host_test: string
  proxy_host_prod: string
  layout_type: 'blank'
  role: 'super' | 'ordinary' | null
}

export interface IAjaxDependencies {
  type: 'ajax'
  config: {
    url: string
    method?: 'get' | 'post'
    params?: dynamicObject
    data?: dynamicObject
    transform?: (v: any) => any
  }
}

export interface IElementConfig {
  type: string
  props: dynamicObject
  children: (string | number | IElementConfig)[]
}

export type dependencies = IAjaxDependencies | any

export type IPageConfig = any

export interface IUserInfo {
  id: number
  usercode: string
  avatar?: string
  name: string
  role: string
}

export interface IMenuItemData {
  name: string
  icon: string
  path: string
}

/**
 * 面包屑
 */
export interface IPaneItem {
  key: string
  title: string
  content?: React.ReactNode
  closable?: boolean
}

export interface IGlobalState {
  projectList: IProjectDetail[]
  projectDetail: IProjectDetail
  pageConfig: IPageConfig
  userInfo: IUserInfo
  isPageInit: boolean
  menuData: IMenuItemData[]
  projectId: number | string
  draftId: number | string
  createUcid: number | string
  isLocalPage: boolean
  panes?: IPaneItem[]
  activePanekey?: string
}
