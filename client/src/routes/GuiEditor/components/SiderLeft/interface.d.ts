import { ConnectProps } from '~/types/models/connect'
import { IPageConfig, IElementConfig } from '~/types/models/global'
import { selectedComponentData, activeTab } from '~/types/models/guiEditor'

type Option = any
export { IPageConfig, selectedComponentData, Option, IElementConfig }

export interface TheSiderLeftProps extends ConnectProps {
  pageConfig: IPageConfig
  activeTab: activeTab
  isLockIframe: boolean
  selectedComponentData: selectedComponentData
}
