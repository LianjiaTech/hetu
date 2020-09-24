---
order: 5
title: 数据格式转换
---

通过 transform 可将待提交的表单数据格式转换。  
例如在表单提交前, 添加一个额外的参数`id`, 通过设置 transform. transform 接收一个字符串格式的函数 `"<%:=  function(data){} %>"`, 参数`data`为表单的值, transform 必须返回一个对象`{}`, 该对象即为提交的表单.

```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtForm",
  "props": {
    "url": "/api/form/update",
    "fields": [
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
    "buttons": [
      "reset",
      "submit"
    ]
  },
  "children": []
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
