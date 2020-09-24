import { BaseProps } from '~/types'

export interface Props extends BaseProps {
  title: string
  subtitle: string
  extra?: React.ReactNode[]
}
