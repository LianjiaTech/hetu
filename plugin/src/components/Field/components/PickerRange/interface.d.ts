import { BaseProps } from '~/types'

export type HtRangePickerValue = string[]
export interface HtRangePickerProps extends BaseProps {
  value: HtRangePickerValue
  defaultValue?: HtRangePickerValue
  onChange: (v: HtRangePickerValue) => void
  format?: string
  showTime?: boolean
}
