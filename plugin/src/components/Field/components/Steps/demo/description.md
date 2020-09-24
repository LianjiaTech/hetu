---
order: 6
title: 辅助信息
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
            description: 'description1',
          },
          {
            title: 'title2',
            description: 'description2',
          },
          {
            title: 'title3',
            description: 'description3',
          },
        ],
      },
    ],
  },
  children: [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
