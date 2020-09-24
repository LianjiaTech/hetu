import { IUserInfo, IProjectDetail } from '~/types/models/global'
import { FormComponentProps } from 'antd/es/form'
import { ConnectProps, ConnectState } from '~/types/models/connect'
export { IUserInfo, ConnectState }

export interface TheHeaderProps extends FormComponentProps, ConnectProps {
  userInfo: IUserInfo
  projectDetail: IProjectDetail
}
