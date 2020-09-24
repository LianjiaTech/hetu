export default {
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
