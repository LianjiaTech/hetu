---
order: 0
title: 基本用法
---

通常用于数据新建, `labelCol wrapperCol`用于设置表单项的布局样式, 默认值为`labelCol: { span: 6 }, wrapperCol: { span: 14 }`.

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/api/form/update',
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
      {
        field: 'sex',
        title: '性别',
        type: 'Radio',
        options: [
          {
            label: '男',
            value: 1,
          },
          {
            label: '女',
            value: 0,
          },
        ],
      },
      {
        field: 'hobbies',
        title: '爱好',
        tooltip: '你是程序员？',
        type: 'Checkbox',
        allCheck: true,
        options: ['打王者', '吃鸡', '宅', '追剧'],
      },
      {
        field: 'job',
        title: '职业',
        type: 'Select',
        options: ['FE', 'IOS', 'Android', 'RD'],
      },
      {
        field: 'remark',
        title: '个人宣言',
        type: 'Input.TextArea',
      },
    ],
    buttons: ['reset', 'submit'],
  },
  children: [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
