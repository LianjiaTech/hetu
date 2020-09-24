---
order: 6
title: 辅助信息
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
        "description": "Additional description and information about copywriting."
      },
      {
        "title": "info",
        "type": "Alert",
        "alertType": "info",
        "showIcon": true,
        "message": "Info Text",
        "description": "Additional description and information about copywriting."
      },
      {
        "title": "warning",
        "type": "Alert",
        "alertType": "warning",
        "showIcon": true,
        "message": "Warning Text",
        "description": "Additional description and information about copywriting."
      },
      {
        "title": "error",
        "type": "Alert",
        "alertType": "error",
        "showIcon": true,
        "message": "Error Text",
        "description": "Additional description and information about copywriting.<a href='http://hetu.com'>666</a>"
      },
    ],
  },
  "children": [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
