import { RadioChangeEvent } from 'antd/lib/radio'
import { ExtraOption } from '../Checkbox/interface'
import { BaseProps, JsonSchema } from '~/types'

export { ExtraOption }

export type HtRadioValue = string | number | boolean

export interface HtRadioProps extends BaseProps {
  defaultValue?: HtRadioValue
  value: HtRadioValue
  onChange: (v: RadioChangeEvent) => void
  disabled?: boolean
  name?: string
  buttonStyle?: 'outline' | 'solid'
  labelField?: string
  valueField?: string
  optionsSourceType?: JsonSchema.OptionsSourceType
  options?: JsonSchema.HtFieldOption[]
  optionsDependencies?: JsonSchema.HtFieldOption[]
  // 是否允许动态添加选项
  canAddOption?: boolean
}

export interface HtRadioState {
  isModalVisible: boolean
  // 用户自己添加的options
  extraOptions: ExtraOption[]
}
