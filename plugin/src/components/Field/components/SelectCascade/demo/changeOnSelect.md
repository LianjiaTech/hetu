---
order: 3
title: 动态加载选项
---

- 使用 `loadData` 实现动态加载选项。
- `loadData` 无法和`showSearch` 一起使用

![](https://user-gold-cdn.xitu.io/2020/4/27/171b97e7c02290d6?w=992&h=500&f=png&s=190091)

```jsx
import Hetu from 'hetu'

const remote = {
  cityOptions: {
    url: '/api/tree/1',
  },
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/',
    buttons: [],
    fields: [
      {
        field: 'version',
        title: '级联选择',
        type: 'SelectCascade',
        showSearch: false,
        changeOnSelect: true,
        labelField: 'title',
        valueField: 'value',
        options: '<%:=  cityOptions %>',
        loadDataConfigs: [
          {
            url: '/api/tree/2',
            searchField: 'key',
          },
          {
            url: '/api/tree/3',
            searchField: 'key',
          },
          {
            url: '/api/tree/4',
            searchField: 'key',
          },
        ],
      },
    ],
  },
  children: [],
}

ReactDOM.render(
  <Hetu elementConfig={elementConfig} remote={remote} />,
  mountNode
)
```
