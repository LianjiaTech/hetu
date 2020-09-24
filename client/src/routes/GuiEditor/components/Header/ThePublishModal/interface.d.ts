import { ConnectProps, ConnectState } from '~/types/models/connect'
import { activeTab } from '~/types/models/guiEditor'

import { FormComponentProps } from 'antd/es/form'

export { ConnectState }

export interface Props extends ConnectProps, FormComponentProps {
  projectId: number
  pageId: number
  draftId: number

  visible: boolean

  onClose: () => void
}
