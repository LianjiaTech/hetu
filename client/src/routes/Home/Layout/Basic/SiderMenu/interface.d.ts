import { RouteComponentProps } from 'react-router'
import { IUserInfo, IProjectDetail } from '~/types/models/global'
import * as H from 'history'

export interface menuItem {
  path: string
  icon: string
  key: string
  name?: string
  hideInMenu?: boolean
  target?: string
  children?: menuItem[]
}

export interface TheSiderMenuProps {
  history: H.History
  projectDetail: IProjectDetail
}

export interface TheSiderMenuState {
  flatMenuKeys?: string[]
  openKeys?: string[]
  collapsed: boolean
}
