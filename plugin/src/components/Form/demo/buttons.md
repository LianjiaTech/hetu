---
order: 3
title: 三种按钮
---

提供三种基本的按钮 提交:`submit reset back jumpTo`, 同时也支持自定义按钮。

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/api/list/download?ids=123',
    fields: [
      {
        field: 'name',
        title: '姓名',
      },
    ],
    buttons: ['reset', 'submit', 'back', 'download'],
  },
  children: [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
