import { FormComponentProps } from 'antd/es/form'
import { ConnectProps, ConnectState } from '~/types/models/connect'

export interface PageTemplatesProps extends FormComponentProps, ConnectProps {
  visible: boolean
  onChange: (visible: boolean) => void
  pageConfig: dynamicObject
  projectList: dynamicObject[]
}

export type activeTabKeyType = 'all'

export interface PageTemplatesState {
  activeTabKey: activeTabKeyType
  templateData: any[]
}
