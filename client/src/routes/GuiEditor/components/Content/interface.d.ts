import { ConnectProps, ConnectState } from '~/types/models/connect'
import { IPageConfig, IElementConfig } from '~/types/models/global'
import { selectedComponentData, ContainerData, activeTab, reac } from '~/types/models/guiEditor'

export { ConnectState, selectedComponentData, IPageConfig, ContainerData, IElementConfig }

export interface Props extends ConnectProps {
  isIframeLoading: boolean
  hoverComponentData: selectedComponentData
  selectedComponentData: selectedComponentData
  activeTab: activeTab
  pageConfig: IPageConfig
  isLockIframe: boolean
  isDragging: boolean
  isInsertItemMode: boolean
  containerData: ContainerData
}
