import { BaseProps } from '~/types'

type AlertType = 'success' | 'info' | 'warning' | 'error'

export interface Props extends BaseProps {
  message: string
  description?: string
  banner?: boolean
  closable?: boolean
  showIcon?: boolean
  alertType?: AlertType
}
