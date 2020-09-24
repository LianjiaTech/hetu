---
order: 0
title: 基本使用
---

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/',
    buttons: [],
    fields: [
      {
        title: 'success',
        type: 'Alert',
        alertType: 'success',
        message: 'Success Text',
      },
      {
        title: 'info',
        alertType: 'info',
        type: 'Alert',
        message: 'Info Text',
      },
      {
        title: 'warning',
        type: 'Alert',
        alertType: 'warning',
        message: 'Warning Text',
      },
      {
        title: 'error',
        type: 'Alert',
        alertType: 'error',
        message: 'Error Text',
      },
    ],
  },
  children: [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
