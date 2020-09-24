---
order: 0
title: cardType
---

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtList',
  props: {
    cardType: 'primary',
    description: '这是说明阿斯顿发哈时间快点发贺卡上绝代风华接口',
    url: '/api/list',
    pageSize: 2,
    columnsSetting: true,
    columns: [
      {
        title: 'id',
        dataIndex: 'id',
        width: 50,
        tooltip: '你好',
      },
      {
        title: 'banner',
        dataIndex: 'imageUrl',
        width: 60,
        renderType: 'img',
      },
      {
        title: '预览链接',
        dataIndex: 'preview',
        width: 80,
        renderType: 'a',
      },
      {
        title: '标签',
        dataIndex: 'tags',
        renderType: 'tag',
        width: 100,
        isWrapper: true,
      },
      {
        title: '开关',
        dataIndex: 'switch',
        renderType: 'switch',
        url: '/api/form/update',
        width: 100,
      },
    ],
  },
  children: [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
