---
order: 0
title: 基本使用
---

支持编辑的类型
- `number`
- `string`
- `boolean`
- `object`
- `array`
- `null`

```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": 'HtForm',
  "props": {
    "url": '/',
    "fields": [
      {
        "field": "basic",
        "title": "Json编辑",
        "type": "JsonEditor"
      },
      {
        "field": "string",
        "title": "string",
        "disabled": true,
        "defaultValue": "\"abcdefg\"",
        "type": "JsonEditor"
      },
      {
        "field": "number",
        "title": "number",
        "defaultValue": "1234",
        "type": "JsonEditor"
      },
      {
        "field": "bool",
        "title": "bool",
        "defaultValue": "false",
        "type": "JsonEditor"
      },
      {
        "field": "object",
        "title": "object",
        "defaultValue": "{ \"a\": 1, \"b\": true, \"c\": \"abcde\" }",
        "type": "JsonEditor"
      },
      {
        "field": "array",
        "title": "array",
        "defaultValue": "[{ \"a\": 1 }]",
        "type": "JsonEditor"
      }
    ]
  },
  "children": []
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
