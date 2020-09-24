---
order: 0
title: scroll
---

当列表项较多时, 可以设置表格的最小宽度
- scroll
  - x 设置x轴方向的宽度

```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtForm",
  "props": {
    "url": "/api/form/update",
    "labelCol": {
      "span": 24
    },
    "wrapperCol": {
      "span": 24
    },
    "fields": [
      {
        "field": "menuData",
        "title": "菜单",
        "type": "EditableTable",
        "defaultValue": [
          {
            "path": "/template/list/1",
            "name": "列表页模版",
            "icon": "hdd"
          }
        ],
        "scroll": {
          "x": 1200
        },
        "columns": [
          {
            "title": "页面路径",
            "dataIndex": "path",
            "width": "30%"
          },
          {
            "title": "名称",
            "dataIndex": "name",
            "width": "25%"
          },
          {
            "title": "icon",
            "dataIndex": "icon",
            "width": "30%",
            "type": "Select",
            "options": [ "hdd","menu", "user","pic-center", "ordered-list", "unordered-list"]
          }
        ]
      }
    ]
  },
  "children": []
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
