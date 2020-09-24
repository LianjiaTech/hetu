import { FormComponentProps } from 'antd/es/form'
import { WrappedFormUtils } from 'antd/es/form/Form'
import { ExtraOption } from '../interface'

export type form = WrappedFormUtils<any>

export interface ModalAddOptionProps extends FormComponentProps {
  visible: boolean
  onOpen: () => void
  onOk: (formData: ExtraOption) => void
  onCancel: () => void
  options: ExtraOption[]
  width?: number
  title?: string
  isPlainOption?: boolean
}
