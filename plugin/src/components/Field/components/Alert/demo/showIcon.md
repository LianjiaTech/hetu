---
order: 2
title: 显示icon
---

```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtForm",
  "props": {
    "url": "/",
    "buttons": [],
    "fields": [
      {
        "title": "success",
        "type": "Alert",
        "alertType": "success",
        "showIcon": true,
        "message": "Success Text",
      },
      {
        "title": "info",
        "type": "Alert",
        "alertType": "info",
        "showIcon": true,
        "message": "Info Text"
      },
      {
        "title": "warning",
        "type": "Alert",
        "alertType": "warning",
        "showIcon": true,
        "message": "Warning Text"
      },
      {
        "title": "error",
        "type": "Alert",
        "alertType": "error",
        "showIcon": true,
        "message": "Error Text"
      },
    ],
  },
  "children": [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig}/>, mountNode)
```
