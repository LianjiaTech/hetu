---
order: 7
title: 获取表单的值
---

- `alias` 即获取表单值字段的别名, 默认值为`$$HtForm`
- 在 json 中, 通过语法`<%:= $$HtForm.isOpen %>`即可获取`isOpen`的值

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/api/form/update',
    fields: [
      {
        field: 'isOpen',
        title: '是否启用',
        type: 'Radio',
        options: ['是', '否'],
      },
      {
        field: 'age',
        title: '年龄',
        type: 'InputNumber',
        disabled: "<%:= $$HtForm.isOpen === '否' %>",
      },
    ],
  },
  children: [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
