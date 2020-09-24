---
order: 0
title: 子元素
---

- `canAddChildren` 允许添加子元素


```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtForm",
  "props": {
    "url": "/api/form/update",
    "fields": [
      {
        "field": "menuData",
        "title": "菜单",
        "type": "EditableTable",
        "canAddChildren": true,
        "defaultValue": [
          {
            "path": "/template/list/1",
            "name": "列表页模版",
            "icon": "list"
          }
        ],
        "columns": [
          {
            "title": "页面路径",
            "dataIndex": "path",
            "width": "35%"
          },
          {
            "title": "名称",
            "dataIndex": "name",
            "width": "25%"
          },
          {
            "title": "icon",
            "dataIndex": "icon",
            "width": "20%"
          }
        ]
      }
    ],
    "labelCol": {
      "span": 24
    },
    "wrapperCol": {
      "span": 24
    }
  },
  "children": []
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
