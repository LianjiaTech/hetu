/* eslint-disable no-template-curly-in-string */
interface DefaultValue {
  [key: string]: any
}

let HtButton: DefaultValue = {
  type: 'HtButton',
  props: {
    href:
      "<%:= '/mock/api/list/download?ids='+$$tableSelectionRowKeys.join() %>",
    useH5Href: true,
    text: '批量下载',
  },
}

let HtModalForm: DefaultValue = {
  type: 'HtModalForm',
  props: {
    url: '/mock/api/update',
    fields: [
      {
        field: 'ids',
        title: '批量id',
        defaultValue: '<%:= $$tableSelectionRowKeys %>',
        required: true,
        disabled: true,
      },
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
    triggerButtonText: '批量编辑',
    onSuccessAction: 'trigger:HtList.resetSearch',
  },
}

const map = {
  HtButton,
  HtModalForm,
}

export type componentType = keyof typeof map

export default map
