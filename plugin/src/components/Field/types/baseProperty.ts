import { Editor } from '~/types'
import {
  colProps,
  defaultValue,
  disabled,
  extra,
  field,
  onChangeRequests,
  placeholder,
  required,
  setFieldValues,
  title,
  triggerOnChanges,
  visible,
} from './commonPropsDefine'

const baseProperty: Editor.BaseProperties = {
  field,
  title,
  placeholder,
  extra,
  defaultValue,
  required,
  disabled,
  'v-if': visible,
  colProps,
  onChangeRequests,
  setFieldValues,
  triggerOnChanges,
}

export default baseProperty
