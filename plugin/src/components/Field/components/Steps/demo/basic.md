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
        field: 'step',
        type: 'Steps',
        current: 0,
        initial: 0,
        direction: 'horizontal',
        steps: [
          {
            title: 'title1',
          },
          {
            title: 'title2',
          },
          {
            title: 'title3',
          },
        ],
      },
    ],
  },
  children: [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
