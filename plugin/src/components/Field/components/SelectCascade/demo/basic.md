---
order: 0
title: 基本使用
---

- `defaultValue` 设置默认值, 格式为 `['value1', 'value2']`
- `options` 下拉框选项,格式为
  ```json
  [
    {
      "label": "java",
      "value": "java",
      "children": [
        {
          "label": "0.0.1",
          "value": "0.0.1",
          "disabled": true
        }
      ]
    }
  ]
  ```
  如果要禁用某一项, 可设置`disabled: true`

```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtForm",
  "props": {
    "url": "/",
    "buttons": [],
    "fields": [
      {
        "field": "version",
        "title": "级联选择",
        "type": "SelectCascade",
        "defaultValue": ['java', '0.0.1'],
        "options": [
          {
            "label": "java",
            "value": "java",
            "children": [
              {
                "label": "0.0.1",
                "value": "0.0.1"
              }
            ]
          },
          {
            "label": "javascript",
            "value": "javascript",
            "children": [
              {
                "label": "es5",
                "value": "es5",
                "disabled": true
              },
              {
                "label": "es6",
                "value": "es6"
              }
            ]
          }
        ]
      }
    ],
  },
  "children": [],
}



ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
