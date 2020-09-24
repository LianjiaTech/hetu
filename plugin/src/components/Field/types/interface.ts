import _ from 'lodash'
import { Editor } from '~/types'

export const FieldTypeMap = {
  Input: true,
  InputNumber: true,
  'Input.Password': true,
  'Input.TextArea': true,
  Select: true,
  SelectMultiple: true,
  SelectCascade: true,
  SelectTrees: true,
  Radio: true,
  Checkbox: true,
  Upload: true,
  DatePicker: true,
  MonthPicker: true,
  RangePicker: true,
  WeekPicker: true,
  TimePicker: true,
  // TableEditor: true,
  JsonEditor: true,
}

export type FieldType = keyof typeof FieldTypeMap

export const FieldComponentType = Object.keys(FieldTypeMap) as FieldType[]

/**
 * 获取默认值
 * @param v
 */
export function getDefaultValue(v: Editor.BaseProperties) {
  let result: Record<keyof Editor.BaseProperties, any> = {}
  if (_.isPlainObject(v)) {
    for (let key in v) {
      if (Object.prototype.hasOwnProperty(key)) {
        result[key] = _.get(v, [key, 'defaultValue'])
      }
    }
  }
  return result
}
