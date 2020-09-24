import { BaseProps } from '~/types'

export interface HtDatePickerProps extends BaseProps {
  value: string
  defaultValue?: string
  onChange: (v: string) => void
  format?: string | string[]
}
