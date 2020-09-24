import { BaseProps, JsonSchema } from '~/types'
export type HtCheckboxValue = (string | number | boolean)[]

export interface ExtraOption {
  label: string
  value: number | string | boolean
}

export interface HtCheckboxProps extends BaseProps {
  defaultValue?: HtCheckboxValue
  disabled?: boolean
  optionsSourceType?: JsonSchema.OptionsSourceType
  options?: JsonSchema.HtFieldOption[]
  optionsDependencies?: JsonSchema.HtFieldOption[]
  value: HtCheckboxValue
  onChange: (v: HtCheckboxValue) => void
  labelField?: string
  valueField?: string
  allCheck?: boolean
  // 是否允许动态添加选项
  canAddOption?: boolean
  // 弹框属性配置
  addModalConfig?: JsonSchema.DynamicObject
}

export interface HtCheckboxState {
  indeterminate: boolean
  checkAll: boolean
  isModalVisible: boolean
  // 用户自己添加的options
  extraOptions: ExtraOption[]
}
