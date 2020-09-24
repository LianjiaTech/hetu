---
order: 2
title: 基本使用
---

- `showSearch` 是否开启搜索, 默认为`false`
- `showSearch` 无法和动态加载共存

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
        "showSearch": true,
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
                "value": "es5"
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
