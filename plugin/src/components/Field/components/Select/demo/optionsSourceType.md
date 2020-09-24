---
order: 2
title: optionsSourceType
---

这个属性是为了方便可视化编辑器编辑

- `optionsSourceType` 数据类型, 可选值有
- `static` 静态数据, 默认类型
- `dependencies` remote 配置
- `remote` 自定义

optionsDependencies 和 options 均为下拉框选项配置

- `options` 当`optionsSourceType=static`时,生效
- `optionsDependencies` 当`optionsSourceType=dependencies`时,生效
- `optionsConfig` 当`optionsSourceType=remote`时生效

  ![](https://user-gold-cdn.xitu.io/2020/4/24/171aa259bbf84c0e?w=1078&h=500&f=png&s=285261)

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/',
    buttons: [],
    fields: [
      {
        field: 'hobby1',
        title: '静态数据',
        type: 'Select',
        showSearch: true,
        optionsSourceType: 'static',
        options: [
          {
            label: '骑马',
            value: '1',
          },
          {
            label: '射箭',
            value: '2',
          },
          {
            label: '摔跤',
            value: '3',
          },
        ],
        defaultValue: '3',
      },
      {
        field: 'hobby2',
        title: 'remote配置',
        type: 'Select',
        showSearch: true,
        labelField: 'name',
        valueField: 'value',
        optionsSourceType: 'dependencies',
        optionsDependencies: '<%:=  hobbyOptions %>',
        defaultValue: 'status_key',
      },
      {
        field: 'hobby3',
        title: '自定义',
        type: 'Select',
        showSearch: true,
        searchOnFocus: true,
        labelField: 'name',
        optionsSourceType: 'remote',
        optionsConfig: {
          url: '/api/sugs',
        },
      },
    ],
  },
  children: [],
}

const remote = {
  hobbyOptions: {
    url: '/api/sugs',
  },
}

ReactDOM.render(
  <Hetu elementConfig={elementConfig} remote={remote} />,
  mountNode
)
```
