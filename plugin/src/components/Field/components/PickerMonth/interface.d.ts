import { BaseProps } from '~/types'

export interface HtMonthPickerProps extends BaseProps {
  value: string
  defaultValue?: string
  onChange: (v: string) => void
  format?: string | string[]
}
