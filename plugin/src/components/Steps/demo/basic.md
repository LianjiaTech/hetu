---
order: 0
title: 基本使用
---

可以通过alias定义的变量获取当前步骤，从而控制其它组件的显示、隐藏

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
    "当前步骤:",
    "<%:= $$currentStep %>",
    {
      type: 'HtSteps',
      props: {
        alias: "$$currentStep",
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
      children: [],
    },
  ],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
