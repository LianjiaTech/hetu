import _ from 'lodash'
import * as ReactIs from 'react-is'
import { JsonSchema } from '~/types'
import Alert from './Alert'
import Checkbox from './Checkbox'
import Divider from './Divider'
import Input from './Input'
import InputNumber from './InputNumber'
import JsonEditor from './JsonEditor'
// 时间选择器
import PickerDate from './PickerDate'
import PickerDateTime from './PickerDateTime'
import PickerMonth from './PickerMonth'
import PickerRange from './PickerRange'
import PickerTime from './PickerTime'
import PickerWeek from './PickerWeek'
// 数据输入, Field组件类型
import Radio from './Radio'
// 下拉框
import Select from './Select'
import SelectCascade from './SelectCascade'
import SelectMultiple from './SelectMultiple'
import SelectTree from './SelectTree'
import SelectTrees from './SelectTrees'
// 步骤条
import Steps from './Steps'
import TableEditor from './TableEditor'
// 纯文本
import Text from './Text'
import Upload from './Upload'
import EditableTable from './_EditableTable'

type FieldMap = {
  [key in JsonSchema.HtFieldType]: any
}

export const fieldMap: FieldMap = {
  Checkbox,
  DatePicker: PickerDate,
  DateTimePicker: PickerDateTime,
  MonthPicker: PickerMonth,
  WeekPicker: PickerWeek,
  RangePicker: PickerRange,
  TimePicker: PickerTime,
  Input,
  'Input.Password': Input.Password,
  'Input.TextArea': Input.TextArea,
  InputNumber,
  JsonEditor,
  Upload,
  Radio,
  Select,
  SelectCascade,
  SelectMultiple,
  SelectTree,
  SelectTrees,
  Steps,
  EditableTable,
  TableEditor,
  Divider,
  Text,
  Alert,
}

function checkComponentValid(componentName: string, Component: any) {
  // @ts-ignore
  if (_.get(fieldMap, componentName) !== undefined) {
    console.error(
      `组件 ${componentName} 已存在, 请修改组件名.已有组件名${Object.keys(
        fieldMap
      )}`
    )
    return false
  }

  if (!ReactIs.isValidElementType(Component)) {
    console.warn(`组件 ${componentName} 不符合组件规范`)
    return false
  }
  return true
}

/**
 * 添加Field子组件
 * @param map 组件map, 例如 { Input: Input }
 * @param prefix 组件名前缀, 例如 'Antd', 默认 ''
 */
export function addField(componentName: string, Component: any) {
  if (checkComponentValid(componentName, Component)) {
    // @ts-ignore
    _.set(fieldMap, componentName, Component)
    return true
  }

  return false
}

export default fieldMap
