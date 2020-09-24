import { ConnectProps } from '~/types/models/connect'
import { IPageConfig } from '~/types/models/global'

export interface TheGuiEditorProps extends ConnectProps {
  projectDetail: dynamicObject
  pageConfig: IPageConfig
  isLockIframe: boolean
}
