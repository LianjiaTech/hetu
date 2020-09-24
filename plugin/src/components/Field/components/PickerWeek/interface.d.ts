import { BaseProps } from '~/types'

export interface HtWeekPickerProps extends BaseProps {
  value: string
  defaultValue?: string
  onChange: (v: string) => void
  format?: string
}
