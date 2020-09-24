---
order: 2
title: 批量操作
---

- `selections` 批量操作的按钮
- `$$tableSelectionRowKeys` 批量选中的key, 例如`[1,2]`

```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtList",
  "props": {
    "url": "/api/list",
    "columns": [
      {
        "title": "id",
        "dataIndex": "id",
        "width": 80
      },
      {
        "title": "标签",
        "dataIndex": "tags",
        "width": 100
      }
    ],
    "selections": [
      {
        "type": "HtButton",
        "props": {
          "href": "<%:= '/api/list/download?ids='+$$tableSelectionRowKeys.join() %>",
          "text": "批量下载"
        }
      },
      {
        "type": "HtModalForm",
        "props": {
          "url": "/api/form/update",
          "fields": [
            {
              "field": "ids",
              "title": "批量id",
              "defaultValue": "<%:= $$tableSelectionRowKeys %>",
              "required": true,
              "disabled": true
            },
            {
              "field": "name",
              "title": "姓名"
            },
            {
              "field": "age",
              "title": "年龄",
              "type": "InputNumber"
            }
          ],
          "title": "弹框表单",
          "triggerButtonText": "批量编辑"
        }
      }
    ],
    "pageSize": 2
  },
  "children": []
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
