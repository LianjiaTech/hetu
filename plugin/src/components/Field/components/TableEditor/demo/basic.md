---
order: 0
title: 基本使用
---

- `canAdd` 是否允许添加节点, 默认 true
- `children` 为子节点
- `canAddChildren` 是否允许添加子节点, 默认为 false

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/',
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 24,
    },
    fields: [
      {
        field: 'hobby',
        title: '兴趣',
        type: 'TableEditor',
        disabled: false,
        canAddChildren: true,
        defaultValue: [
          {
            path: 'aaa.com',
            name: '河图',
            icon: 'hdd',
            disabled: 0,
            children: [
              {
                path: 'a.xxx.com',
                name: '个人中心',
                disabled: 1,
                icon: 'user',
              },
            ],
          },
        ],
        columns: [
          {
            title: '页面路径',
            dataIndex: 'path',
            width: '30%',
          },
          {
            title: '名称',
            dataIndex: 'name',
            width: '25%',
          },
          {
            title: '是否开启',
            dataIndex: 'isOpen',
            width: '15%',
            type: 'Radio',
            options: [
              {
                label: '是',
                value: 1,
              },
              {
                label: '否',
                value: 0,
              },
            ],
          },
          {
            title: '服务',
            dataIndex: 'server',
            width: '15%',
            type: 'Select',
            options: [
              { label: '估价', value: '1' },
              { label: '图像识别', value: '2' },
              { label: '商房直连', value: '3' },
              { label: '图片验真', value: '4' },
            ],
          }
        ],
      },
    ],
  },
  children: [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
