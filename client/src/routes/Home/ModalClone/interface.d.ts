import { FormComponentProps } from 'antd/es/form'
import { IProjectDetail, IPageConfig } from '~/types/models/global'

export interface TheCloneModalProps extends FormComponentProps {
  visible: boolean
  pageConfig: IPageConfig
  projectDetail: IProjectDetail

  onChange: (visible: boolean) => void
}

export interface TheCloneModalState {
  projectList: IProjectDetail[]
}
