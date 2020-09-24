interface DefaultValue {
  [key: string]: any
}

let HtButton: DefaultValue = {
  type: 'HtButton',
  props: {
    href: '/',
    text: '跳转页面',
    useH5Href: false,
    type: 'link',
  },
}

let HtModalForm: DefaultValue = {
  type: 'HtModalForm',
  props: {
    url: '/mock/api/update',
    fields: [
      {
        field: 'name',
        title: '姓名',
      },
      {
        field: 'age',
        title: '年龄',
        type: 'InputNumber',
      },
    ],
    title: '弹框表单',
    triggerButtonText: '点我',
    buttonType: 'primary',
  },
}

const map = {
  HtButton,
  HtModalForm,
}

export type componentType = keyof typeof map

export default map
