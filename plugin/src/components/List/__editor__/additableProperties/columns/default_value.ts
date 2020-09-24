/* eslint-disable no-template-curly-in-string */
interface DefaultValue {
  [key: string]: any
}

let text: DefaultValue = {
  title: '标题',
  dataIndex: 'text',
  renderType: 'default',
  width: 100,
}

let a: DefaultValue = {
  title: '跳转链接',
  dataIndex: 'link',
  renderType: 'a',
  text: '预览',
  width: 100,
}

let img: DefaultValue = {
  title: '图片',
  dataIndex: 'img',
  renderType: 'img',
  width: 100,
}

let operations: DefaultValue = {
  title: '操作',
  width: 160,
  renderType: 'operations_new',
  fixed: true,
  operations: [
    {
      text: '跳转',
      actionType: 'jump',
      url: '/xxx/edit',
      transform: '<%:= (row) => ({ ...row }) %>',
    },
    {
      text: '删除',
      actionType: 'xhr',
      url: '/xxx/delete',
    },
  ],
  operations3: [
    {
      type: 'HtModalForm',
      __noRender: true,
      props: {
        triggerButtonText: '弹框',
        title: '编辑',
        width: 516,
        top: 100,
        url: '/mock/api/update',
        method: 'post',
        fields: [
          {
            'v-if': '<%:= true %>',
            field: 'name',
            title: '姓名',
            type: 'Input',
            disabled: false,
            required: true,
          },
        ],
        buttons: ['cancel', 'submit'],
        transform: '<%:= (row, data) => ({  ...row, ...data }) %>',
        'v-if': '<%:= row => true %>',
        buttonType: 'primary',
        cols: 1,
        alias: '$$HtListModalForm',
        type: 'HtModalForm',
      },
      children: [],
    },
  ],
}

let _switch: DefaultValue = {
  title: '开关',
  dataIndex: 'switch',
  renderType: 'switch',
  url: '/mock/api/update',
  width: 80,
}

let enumeration: DefaultValue = {
  title: '性别',
  dataIndex: 'sex_name',
  width: 60,
  type: 'HtList.column',
  showOverflowTooltip: false,
  tooltip: '',
  renderType: 'enumeration',
  sort: false,
  filterColumns: false,
  'v-if': '<%:= row => true %>',
  options: [
    {
      label: '男',
      value: '男',
      color: 'red',
    },
    {
      label: '女',
      value: '女',
      color: 'orange',
    },
  ],
}

const map = {
  text,
  a,
  img,
  operations,
  switch: _switch,
  enumeration,
}

export type componentType = keyof typeof map

export default map
