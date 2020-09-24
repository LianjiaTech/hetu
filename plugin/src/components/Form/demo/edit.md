---
order: 1
title: 设置表单初始值
---

- `$$HtForm` 用来设置表单的初始值。
- `local` 用来保存 静态数据

```jsx
import Hetu from 'hetu'

const local = {
  "$$HtForm": {
    "name": "pyy",
    "age": "27",
  },
}

const elementConfig = {
  "type": "HtForm",
  "props": {
    "url": "/api/form/update",
    "fields": [
      {
        "field": "name",
        "title": "姓名"
      },
      {
        "field": "age",
        "title": "年龄",
        "type": "InputNumber"
      }
    ],
    "buttons": [
      "submit",
      "reset"
    ]
  },
  "children": []
}

ReactDOM.render(<Hetu elementConfig={elementConfig} local={local} />, mountNode)
```
