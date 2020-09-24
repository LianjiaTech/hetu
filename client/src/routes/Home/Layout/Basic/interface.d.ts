import * as H from 'history'
import { IPaneItem, IUserInfo, IProjectDetail } from '~/types/models/global'

export interface LayoutBasicProps {
  history: H.History
  userInfo: IUserInfo
  projectDetail: IProjectDetail
  activePanekey: string
  panes: IPaneItem[]
  onChange: (activePanekey: string, panes: IPaneItem[]) => void
}

export interface LayoutBasicState {}
