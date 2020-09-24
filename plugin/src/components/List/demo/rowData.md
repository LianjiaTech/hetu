---
order: 7
title: 使用列表数据
---

在列操作时, 在弹框中使用表单的值

- 列表数据通过`$$tableRowModalFormData`获取

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
        "width": 200
      },
      {
        "title": "操作",
        "width": 120,
        "operations": [
          {
            "text": "编辑",
            "actionType": "modalForm",
            "url": "/api/form/update",
            "fields": [
              {
                "field": "imageUrl",
                "title": "banner"
              },
              {
                "field": "tags1",
                "title": "标签",
                "defaultValue": "<%:= $$tableRowModalFormData.imageUrl %>"
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


ReactDOM.render(<Hetu elementConfig={elementConfig}/>, mountNode)
```
