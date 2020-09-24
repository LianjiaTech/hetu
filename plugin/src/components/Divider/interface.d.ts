import { DividerProps } from 'antd/lib/divider'
import { BaseProps } from '~/types'

export interface Props extends BaseProps, DividerProps {
  title: string
}
