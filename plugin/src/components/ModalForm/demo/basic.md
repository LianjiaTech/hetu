---
order: 0
title: 基本用法
---

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtModalForm',
  props: {
    url: '/api/form/update',
    fields: [
      {
        field: 'name',
        title: '姓名',
      },
      {
        field: 'age',
        title: '年龄',
        type: 'InputNumber',
      },
    ],
    title: '弹框表单',
    triggerButtonText: '点我',
    buttonType: 'primary',
  },
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
