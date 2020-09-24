---
order: 0
title: 基本使用
---

- `defaultValue` 设置默认值
- `options` 下拉框选项
- `isCheckAll` 设置是否全选


```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtForm",
  "props": {
    "url": "/",
    "buttons": [],

    "fields": [
      {
        "field": "hobbies",
        "title": "兴趣",
        "type": "SelectMultiple",
        "isCheckAll": true,
        "options": [
          {
            "label": "吃饭",
            "value": "1"
          },
          {
            "label": "睡觉",
            "value": "2"
          },
          {
            "label": "打豆豆",
            "value": "3"
          }
        ],
        "defaultValue": [
          "1",
          "2"
        ]
      }
    ],
  },
  "children": [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
