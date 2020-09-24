import { ConnectProps, ConnectState } from '~/types/models/connect'
import { activeTab } from '~/types/models/guiEditor'

export { ConnectState }
export default interface JSONEditorProps extends ConnectProps {
  pageConfig: any
  projectId: number
  pageId: number
  dataPageConfigPath: string
  activeTab: activeTab
}
