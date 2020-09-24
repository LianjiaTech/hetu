import { FormComponentProps } from 'antd/es/form'
import { ConnectProps, ConnectState } from '~/types/models/connect'
import { IPageConfig } from '~/types/models/global'
import { activeTab, selectedComponentData } from '~/types/models/guiEditor'

export { ConnectState }

export type changeValues = {
  [fieldName: string]: any
}

export interface Props extends FormComponentProps, ConnectProps {
  visible: boolean
  formData: dynamicObject
  editConfigData: dynamicObject
  pageConfig: IPageConfig
  selectedComponentData: selectedComponentData
  pageId: number
  activeTab: activeTab

  onChange: (v: dynamicObject) => void
  updatePageConfig: (relativePath: string, newValue: any) => void
  updatePageConfigAndReload: (newValue: any) => void
}

export interface State {}
