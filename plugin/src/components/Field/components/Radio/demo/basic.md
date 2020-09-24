---
order: 0
title: 基本使用
---

- `defaultValue` 设置默认值
- `options` 下拉框选项
- `canAddOption` 允许动态添加选项

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/',
    buttons: [],
    fields: [
      {
        field: 'sex',
        title: '性别',
        type: 'Radio',
        canAddOption: true,
        options: ['男', '女'],
      },
      {
        field: 'sex',
        title: '是否禁用',
        type: 'Radio',
        options: [
          {
            label: '是',
            value: 1,
          },
          {
            label: '否',
            value: 0,
          },
        ],
      },
    ],
  },
  children: [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
