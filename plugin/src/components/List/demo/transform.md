---
order: 1
title: transform
---

transform 用于表单数据格式处理, 详情见下文

```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtList",
  "props": {
    "url": "/api/list",
    "buttons": [],
    "columns": [
      {
        "title": "id",
        "dataIndex": "id",
        "width": 60
      },
      {
        "title": "text",
        "dataIndex": "text",
        "width": 200,
        "showOverflowTooltip": true
      },
      {
        "title": "操作",
        "width": 120,
        "operations": [
          {
            "text": "查看",
            "actionType": "open",
            "url": "http://aaa.com",
            "transform": "<%:= row => ({bannerId: row.id}) %>"
          },
          {
            "text": "编辑",
            "actionType": "modalForm",
            "url": "/api/form/update",
            "width": 600,
            "fields": [
              {
                "field": "imageUrl",
                "title": "banner"
              },
              {
                "field": "tags",
                "title": "标签"
              }
            ],
            "transform": "<%:= (row, data) => ({...data, bannerId: row.id}) %>"
          },
          {
            "text": "删除",
            "actionType": "xhr",
            "url": "/api/xxx/delete",
            "transform": "<%:= row => ({bannerId: row.id}) %>"
          }
        ]
      }
    ],
    "pageSize": 2
  },
  "children": []
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
