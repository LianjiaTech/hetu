import { IPageConfig } from '~/types/models/global'
import { ConnectProps, ConnectState } from '~/types/models/connect'
import { activeTab, selectedComponentData } from '~/types/models/guiEditor'

export { ConnectState, selectedComponentData }

export interface Props extends ConnectProps {
  projectId: number
  pageId: number
  activeTab: activeTab
  isLockIframe: boolean
  pageConfig: IPageConfig
  selectedComponentData: selectedComponentData
}

export interface State {}
