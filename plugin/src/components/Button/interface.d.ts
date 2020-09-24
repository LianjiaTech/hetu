import { ButtonProps } from 'antd/es/button'
import { BaseProps } from '~/types'

export interface HtButtonComponentProps extends ButtonProps, BaseProps {
  to?: string
  href?: string
  text: string
  className?: string

  // 使用h5原生跳转
  useH5Href?: true
  linkTarget?: boolean
}
