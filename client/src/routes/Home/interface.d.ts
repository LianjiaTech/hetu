import * as H from 'history'
import { IPageConfig, IPaneItem, IUserInfo, IProjectDetail } from '~/types/models/global'

export { IProjectDetail }

export interface PageHomeProps {
  history: H.History
}

export interface PageHomeState {
  isCloneModalVisible: boolean
  isPageInit: boolean
  isLocalPage: boolean
  errorMessage?: string

  pageConfig?: IPageConfig
  projectDetail?: IProjectDetail
  userInfo?: IUserInfo

  activePanekey?: string
  panes: IPaneItem[]
  uniqueKey: string
}
