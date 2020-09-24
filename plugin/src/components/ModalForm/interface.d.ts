import { ButtonType } from 'antd/es/button'
import { HtFormProps } from '~/components/Form/interface'
import { BaseProps, JsonSchema } from '~/types'
import { _onSuccessActionConfig } from '~/utils/actions'

export interface ModalFormComponentProps extends BaseProps, HtFormProps {
  disabled?: boolean
  mask?: boolean
  onSuccessAction?: JsonSchema.OnSuccessAction
  _onSuccessAction?: _onSuccessActionConfig
  title?: string
  triggerSelector?: string
  triggerButtonText?: string
  triggerButtonProps?: object
  alias?: string
  className?: string
  buttonType?: ButtonType
  top?: number

  onCancel?: Function
  onSuccess?: Function
}

export interface ModalFormComponentState {
  isPageLoading: boolean
  visible: boolean
  top: number
}
