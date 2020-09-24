import { Editor } from '~/types'
import map from './default_value'

const options: Editor.AdditablePropertiesOption[] = [
  {
    label: '单行文本',
    icon: 'tag',
    value: map.Input,
  },
  {
    label: '计数器',
    icon: 'number',
    value: map.InputNumber,
  },
  {
    label: '单选下拉框',
    icon: 'check',
    value: map.Select,
  },
  {
    label: '多选下拉框',
    icon: 'check',
    value: map.SelectMultiple,
  },
  {
    label: '单选框组',
    icon: 'check-circle',
    value: map.Radio,
  },
  // {
  //   label: '多选框组',
  //   icon: 'check-square',
  //   value: map.Checkbox,
  // },
  {
    label: '级联选择',
    icon: 'check',
    value: map.SelectCascade,
  },
  {
    label: '树选择器',
    icon: 'check',
    value: map.SelectTrees,
  },
  {
    label: '日期',
    icon: 'contacts',
    value: map.DatePicker,
  },
  {
    label: '时间',
    icon: 'contacts',
    value: map.TimePicker,
  },
  {
    label: '日期时间',
    icon: 'contacts',
    value: map.DateTimePicker,
  },
  {
    label: '月份',
    icon: 'contacts',
    value: map.MonthPicker,
  },
  {
    label: '周',
    icon: 'contacts',
    value: map.WeekPicker,
  },
  {
    label: '时间范围',
    icon: 'contacts',
    value: map.RangePicker,
  },
  {
    label: '提示框',
    icon: 'alert',
    value: map.Alert,
  },
]

export default options
