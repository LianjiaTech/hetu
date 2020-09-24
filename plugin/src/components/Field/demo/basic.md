---
order: 0
title: 基本用法
---

- `title` 标题
- `field` 字段
- `type` 表单类型, 默认为`Input`, 可选值参考`field 表单类型`
- `defaultValue` 默认值
- `required` 是否必填
- `disabled` 禁用表单
- `placeholder` 引导文案
- `tooltip` 提示信息, 鼠标移上去显示
- 
```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtForm",
  "props": {
    "url": "/mock/api/update",
    "fields": [
      {
        "field": "name",
        "title": "姓名",
        "required": true
      },
      {
        "field": "sex",
        "title": "性别",
        "type": "Radio",
        "defaultValue": 1,
        "options": [
          {
            "label": "男",
            "value": 1
          },
          {
            "label": "女",
            "value": 0
          }
        ]
      },
      {
        "field": "age",
        "title": "年龄",
        "type": "InputNumber"
      },
      {
        "field": "hobbies",
        "title": "爱好",
        "tooltip": "你是程序员？",
        "type": "Checkbox",
        "allCheck": true,
        "disabled": true,
        "options": ["吃饭", "睡觉", "打豆豆"]
      },
      {
        "field": "job",
        "title": "职业",
        "type": "Select",
        "options": ["FE", "IOS", "Android", "RD"]
      },
      {
        "field": "remark",
        "title": "获奖感言",
        "placeholder": "请发布获奖感言",
        "type": "Input.TextArea"
      }
    ],
    "buttons": []
  },
  "children": []
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
