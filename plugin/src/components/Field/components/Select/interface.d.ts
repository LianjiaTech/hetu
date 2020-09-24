import { BaseProps, JsonSchema } from '~/types'

export type HtSelectValue = (string | number)[] | string | number

export interface HtSelectProps<T = HtSelectValue> extends BaseProps {
  value: T
  onChange: (v: T) => void
  labelField?: string
  valueField?: string
  showSearch?: boolean
  remote?: boolean
  optionsSourceType?: JsonSchema.OptionsSourceType
  options?: JsonSchema.HtFieldOption[]
  optionsDependencies?: JsonSchema.HtFieldOption[]
  optionsConfig?: {
    url: string
    method?: JsonSchema.Method
    params?: JsonSchema.DynamicObject
    data?: JsonSchema.DynamicObject
    field?: string
    transform?: Function
  }
  showIcon?: true
  searchOnFocus?: boolean
  // 是否为多选, 默认为false
  isMultiple?: boolean
  labelInValue: boolean
  // 是否可以全选, 默认为false
  isCheckAll?: boolean
}

export interface HtSelectState {
  plainOptions: any[]
  remote: boolean
}
