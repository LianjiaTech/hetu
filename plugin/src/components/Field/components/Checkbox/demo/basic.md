---
order: 0
title: 基本使用
---

- `defaultValue` 设置默认值
- `allCheck` 允许全选
- `canAddOption` 允许动态添加属性
- `options` 下拉框选项
- `labelField` 设置`options`的显示值字段, 默认为`label`
- `valueField` 设置`options`的显示值字段, 默认为`value`

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/',
    buttons: [],
    fields: [
      {
        field: 'hobbies',
        title: '兴趣',
        type: 'Checkbox',
        canAddOption: true,
        labelField: 'label',
        valueField: 'value',
        options: [
          {
            label: '吃饭',
            value: 'chifang',
          },
          {
            label: '睡觉',
            value: 'shuijiao',
          },
          {
            label: '打豆豆',
            value: 'dadoudou',
          },
        ],
        defaultValue: ['shuijiao'],
        allCheck: true,
      },
    ],
  },
  children: [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
