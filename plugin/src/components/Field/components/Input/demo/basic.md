---
order: 0
title: 基本使用
---

提供三种输入框

- `Input`
- `Input.TextArea`
- `Input.Password`

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/',
    buttons: [],
    fields: [
      {
        field: 'name',
        title: 'Input',
      },
      {
        field: 'desc',
        title: 'Input.TextArea',
        type: 'Input.TextArea',
        rows: 6,
      },
      {
        field: 'psw',
        title: 'Input.Password',
        type: 'Input.Password',
      },
    ],
  },
  children: [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
