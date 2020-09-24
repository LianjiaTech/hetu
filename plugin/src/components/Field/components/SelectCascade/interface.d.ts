import { CascaderOptionType } from 'antd/es/cascader'
import { BaseProps } from '~/types'

export interface LoadDataConfig {
  url: string
  params?: object
  searchField?: string
  transform?: (v: any) => []
}

export interface HtSelectCascadeProps<T = string[]> extends BaseProps {
  value: T
  defaultValue?: T
  onChange: (v: T) => void
  labelField: string
  valueField: string
  options: CascaderOptionType[]
  disabled?: boolean
  placeholder?: string
  showSearch?: boolean
  changeOnSelect?: boolean
  loadDataConfigs?: LoadDataConfig[]
}

export interface HtSelectCascadeState {
  _preOptions?: CascaderOptionType[]
  _options?: CascaderOptionType[]
}
