import { ConnectProps, ConnectState } from '~/types/models/connect'
import { IPageConfig } from '~/types/models/global'
import { activeTab } from '~/types/models/guiEditor'

import { FormComponentProps } from 'antd/es/form'

export { ConnectState, IPageConfig }

export interface Props extends ConnectProps, FormComponentProps {
  projectId: number
  pageId: number
  draftId: number
  pageConfig: IPageConfig
  query: dynamicObject
  activeTab: activeTab
  visible: boolean
  onClose: () => void
}

export interface State {
  // 发布的弹框
  isPublishModalVisible: boolean
  // JSON编辑的弹框
  isEditModalVisible: boolean
  isChanged: boolean
  pageConfig?: dynamicObject
  query?: string
}
