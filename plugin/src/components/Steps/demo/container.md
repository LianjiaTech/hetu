---
order: 1
title: 作为容器使用
---

可以作为容器使用，展示每一步骤的信息

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtGuiContainer',
  props: {
    style: {
      padding: '8px',
    },
  },
  children: [
    {
      type: 'HtSteps',
      props: {
        current: 0,
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
      children: ['第一步', '第二步', '第三步'],
    },
  ],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
