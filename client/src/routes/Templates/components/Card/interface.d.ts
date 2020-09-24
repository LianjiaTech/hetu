import { FormComponentProps } from 'antd/es/form'
import { ConnectProps, ConnectState } from '~/types/models/connect'

export interface templateData {
  id: '/project/template/list/1'
  desc: '搜索+列表'
  imgUrl: string
  config: any
}

export interface TheCardProps extends FormComponentProps, ConnectProps {
  data: templateData
  projectDetail: dynamicObject
}

export interface TheCardState {
  isHover: boolean
  isModalVisible: boolean
  templateData: dynamicObject
  isTempModalVisible: boolean
}
