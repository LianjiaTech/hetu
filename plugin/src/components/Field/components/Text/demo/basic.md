---
order: 0
title: 基本使用
---

- `defaultValue` 设置默认值
- `options` 下拉框选项

```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtForm",
  "props": {
    "url": "/",
    "buttons": [],
    "fields": [
      {
        "field": "string",
        "title": "字符串",
        "type": "Text",
        "isWrap": true,
      },
      {
        "field": "number",
        "title": "数字",
        "type": "Text"
      },
      {
        "field": "boolean",
        "title": "布尔",
        "type": "Text"
      },
      {
        "field": "array",
        "title": "数组",
        "type": "Text"
      },
      {
        "field": "object",
        "title": "对象",
        "type": "Text",
        "jsonFormat": true
      },
      {
        "field": "defaultValue",
        "title": "默认值",
        "type": "Text",
        "defaultValue": 1234
      }
    ],
  },
  "children": [],
}

const local = {
  "$$HtForm": {
    string: '字符串\r\n字符串2',
    number: 12,
    boolean: true,
    array: [1,2],
    object: { a:1, b:1, c:1, d:1, e:1, f:1, o:1, p:1, q:1, r:1, s:1, t:1, u:1, v:1 }
  }
}

ReactDOM.render(<Hetu elementConfig={elementConfig} local={local}/>, mountNode)
```
