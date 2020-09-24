import { BaseProps } from '~/types'

export interface HtTimePickerProps extends BaseProps {
  value: string
  defaultValue?: string
  onChange: (v: string) => void
  format?: string
}
