/* eslint-disable no-template-curly-in-string */
/**
 * fields选项,不同类型的默认值
 */

import { Editor } from '~/types'

type fieldValue = {
  [key in keyof Editor.BaseProperties]: any
}

let Input: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'name',
  title: '单行文本',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  type: 'Input',
  defaultValue: '',
}

let InputTextArea: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'remark',
  title: '多行文本',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  defaultValue: '',
  type: 'Input.TextArea',
}

let InputPassword: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'remark',
  title: '密码',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  defaultValue: '',
  type: 'Input.Password',
}

let InputNumber: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'age',
  title: '计数器',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  type: 'InputNumber',
}

let Select: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'line',
  title: '单选下拉框',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  options: [
    {
      label: 'FE',
      value: 'FE',
    },
    {
      label: 'IOS',
      value: 'IOS',
    },
    {
      label: 'Android',
      value: 'Android',
    },
    {
      label: 'RD',
      value: 'RD',
    },
  ],
  defaultValue: 'RD',
  optionsSourceType: 'static',
  labelInValue: false,
  showSearch: false,
  type: 'Select',
}

let SelectMultiple: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'skill',
  title: '多选下拉框',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  options: [
    {
      label: 'react',
      value: 'react',
    },
    {
      label: 'vue',
      value: 'vue',
    },
    {
      label: 'angular',
      value: 'angular',
    },
    {
      label: 'jquery',
      value: 'jquery',
    },
  ],
  defaultValue: ['react', 'vue'],
  labelInValue: false,
  showSearch: false,
  optionsSourceType: 'static',
  type: 'SelectMultiple',
}

let SelectCascade: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'address',
  title: '地址',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  options: [
    {
      label: '北京',
      value: '110000',
      children: [
        {
          label: '北京',
          value: '110000-1',
        },
      ],
    },
    {
      label: '广东',
      value: '140000',
      children: [
        {
          label: '广州',
          value: '140000-1',
        },
        {
          label: '东莞',
          value: '140000-2',
          disabled: true,
        },
      ],
    },
  ],
  defaultValue: [],
  loadDataConfigs: [],
  showSearch: false,
  type: 'SelectCascade',
}

// let SelectTree: fieldValue = {
//   field: 'tree1',
//   title: '树选择器旧',
//   type: 'SelectTree',
//   showSearch: true,
//   treeCheckable: false,
//   labelField: 'title',
//   valueField: 'value',
//   searchConfigs: [
//     {
//       url: '/mock/api/tree/1',
//       searchField: 'key',
//     },
//     {
//       url: '/mock/api/tree/2',
//       searchField: 'key',
//     },
//     {
//       url: '/mock/api/tree/3',
//       searchField: 'key',
//     },
//     {
//       url: '/mock/api/tree/4',
//       searchField: 'key',
//     },
//   ],
// }

let SelectTrees: fieldValue = {
  field: 'tree2',
  title: '树选择器',
  type: 'SelectTrees',
  showSearch: true,
  treeCheckable: false,
  labelField: 'title',
  valueField: 'value',
  splitTag: '>>>',
  optionsSourceType: 'all',
  searchConfigs: [
    {
      url: '/mock/api/tree/all',
      searchField: '',
    },
  ],
}

let Radio: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'state',
  title: '单选框组',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  options: [
    {
      label: '启用',
      value: '<%:= 1 %>',
    },
    {
      label: '禁用',
      value: '<%:= 0 %>',
    },
  ],
  defaultValue: 1,
  type: 'Radio',
  optionsSourceType: 'static',
}

let Checkbox = {
  'v-if': '<%:= true %>',
  field: 'city',
  title: '多选框组',
  disabled: false,
  tooltip: '选择城市',
  required: false,
  placeholder: '',
  allCheck: true,
  options: [
    {
      label: '北京',
      value: 'bj',
    },
    {
      label: '上海',
      value: 'sh',
    },
    {
      label: '杭州',
      value: 'hz',
    },
    {
      label: '深圳',
      value: 'sz',
    },
  ],
  defaultValue: ['sz'],
  type: 'Checkbox',
  optionsSourceType: 'static',
}

let Upload: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'image',
  title: '文件上传',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  max: 1,
  uploadProps: {
    action: '/api/upload',
    accept: '.png,.jpg',
    multiple: false,
    name: 'file',
  },
  type: 'Upload',
}

let TimePicker = {
  'v-if': '<%:= true %>',
  field: 'TimePicker',
  title: '时间选择',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  type: 'TimePicker',
}

let DatePicker: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'DatePicker',
  title: '日期选择',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  format: 'YYYY-MM-DD',
  showTime: false,
  showToday: true,
  type: 'DatePicker',
}

let DateTimePicker: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'DatePicker',
  title: '日期时间',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  format: 'YYYY-MM-DD HH:mm:ss',
  showTime: true,
  showToday: true,
  type: 'DatePicker',
}

let WeekPicker: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'WeekPicker',
  title: '周选择',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  type: 'WeekPicker',
}

let MonthPicker: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'MonthPicker',
  title: '月份选择',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  type: 'MonthPicker',
}

let RangePicker: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'RangePicker',
  title: '时间范围',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  size: 'default',
  format: 'YYYY-MM-DD',
  showTime: false,
  type: 'RangePicker',
}

let TableEditor: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'TableEditor',
  title: '可编辑表格',
  disabled: false,
  tooltip: '',
  required: false,
  placeholder: '',
  type: 'TableEditor',
  canAdd: true,
  canAddChildren: false,
  defaultValue: [],
  columns: [
    {
      title: '页面路径',
      dataIndex: 'path',
      width: '30%',
      type: 'Input',
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: '25%',
      type: 'Input',
    },
    {
      title: 'icon',
      dataIndex: 'icon',
      width: '30%',
      type: 'Select',
      options: [
        'hdd',
        'menu',
        'user',
        'pic-center',
        'ordered-list',
        'unordered-list',
      ],
    },
  ],
}

const JsonEditor: fieldValue = {
  'v-if': '<%:= true %>',
  field: 'JsonEditor',
  title: 'JSON编辑器',
  disabled: false,
  tooltip: '',
  required: false,
  height: 100,
  type: 'JsonEditor',
}

// 分割线
const Divider = {
  title: '',
  type: 'Divider',
}

let Alert: fieldValue = {
  'v-if': '<%:= true %>',
  message: '提示内容',
  description: '',
  type: 'Alert',
  alertType: 'info',
  showIcon: true,
  colSpan: 24,
  colPush: 0,
  style: {
    marginBottom: '10px',
  },
}

const fieldsMap = {
  Input,
  'Input.TextArea': InputTextArea,
  'Input.Password': InputPassword,
  InputNumber,
  Select,
  SelectMultiple,
  SelectCascade,
  SelectTrees,
  Radio,
  Checkbox,
  Upload,
  TimePicker,
  DatePicker,
  DateTimePicker,
  WeekPicker,
  MonthPicker,
  RangePicker,
  TableEditor,
  JsonEditor,
  Divider,
  Alert,
}

export type componentType = keyof typeof fieldsMap

export default fieldsMap
