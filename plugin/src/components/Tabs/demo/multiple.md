---
order: 2
title: 多个页面
---

作为页面切换按钮

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtTabs',
  props: {
    tabsType: 'line',
    defaultActiveKey: 'tab1',
    tabs: [
      {
        title: 'tab-1',
        value: 'tab1',
        showIndexs: [0],
      },
      {
        title: 'tab-2',
        value: 'tab2',
        showIndexs: [1],
      },
    ],
    content: [
      {
        type: 'HtList',
        props: {
          url: '/api/list',
          fields: [
            {
              field: 'id',
              title: 'bannerId',
            },
            {
              field: 'tags',
              title: '标签',
            },
          ],
          columns: [
            {
              title: 'id',
              dataIndex: 'id',
              width: 60,
            },
            {
              title: 'text',
              dataIndex: 'text',
              width: 200,
            },
            {
              title: '操作',
              width: 120,
              operations: [
                {
                  text: '查看',
                  actionType: 'open',
                  url: 'http://aaa.com',
                },
                {
                  text: '编辑',
                  actionType: 'modalForm',
                  url: '/api/form/update',
                  fields: [
                    {
                      field: 'imageUrl',
                      title: 'banner',
                    },
                    {
                      field: 'tags',
                      title: '标签',
                    },
                  ],
                },
                {
                  text: '删除',
                  actionType: 'xhr',
                  url: '/api/xxx/delete',
                },
              ],
            },
          ],
          pageSize: 2,
        },
        children: [],
      },
      {
        type: 'HtList',
        props: {
          url: '/api/list',
          pageSize: 2,
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
              sort: true,
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
      },
    ],
  },
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
