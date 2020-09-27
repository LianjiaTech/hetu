---
order: 0
title: 分割线
---

```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtForm",
  "props": {
    "url": "/api/update",
    "fields": [
      {
        "title": "分割线-左",
        "type": "Divider",
        "orientation": "left"
      },
      {
        "title": "分割线-中",
        "type": "Divider",
        "orientation": "center"
      },
      {
        "title": "分割线-右",
        "type": "Divider",
        "orientation": "right"
      }
    ],
    "buttons": []
  },
  "children": []
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
