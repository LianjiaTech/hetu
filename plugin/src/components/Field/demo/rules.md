---
order: 0
title: 正则校验
---

- 只能应用于文本输入框`Input`

- 
```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtForm",
  "props": {
    "url": "/api/update",
    "fields": [
      {
        "field": "integer",
        "title": "只能输入数字",
        "required": true,
        "type": "Input",
        "rules": [
          {
            "type": "number",
            "message": "只能输入数字"
          }
        ]
      },
      {
        "field": "url",
        "title": "只能输入url",
        "required": true,
        "type": "Input",
        "rules": [
          {
            "type": "url",
            "message": "请输入正确的url"
          }
        ]
      },
      {
        "field": "email",
        "title": "只能输入email",
        "required": true,
        "type": "Input",
        "rules": [
          {
            "type": "email",
            "message": "请输入正确的email"
          }
        ]
      },
      {
        "field": "phone",
        "title": "只能输入手机号",
        "required": true,
        "type": "Input",
        "rules": [
          {
            "type": "phone",
            "message": "请输入正确的手机号"
          }
        ]
      },
      {
        "field": "IDCard",
        "title": "只能输入身份证号",
        "required": true,
        "type": "Input",
        "rules": [
          {
            "type": "IDCard",
            "message": "请输入正确的身份证号"
          }
        ]
      },
      {
        "field": "date",
        "title": "只能输入日期",
        "tooltip": "日期格式(YYYY-MM-DD)",
        "required": true,
        "type": "Input",
        "rules": [
          {
            "type": "date",
            "message": "请输入正确的日期"
          }
        ]
      },
      {
        "field": "chinese",
        "title": "只能输入中文",
        "required": true,
        "type": "Input",
        "rules": [
          {
            "type": "chinese",
            "message": "只能输入中文"
          }
        ]
      },
      {
        "field": "english",
        "title": "只能输入英文",
        "required": true,
        "type": "Input",
        "rules": [
          {
            "type": "english",
            "message": "只能输入英文"
          }
        ]
      },
      {
        "field": "custom",
        "title": "自定义正则",
        "tooltip": "只能输入字母、数字、下划线组合",
        "required": true,
        "rules": [
          {
            "type": "custom",
            "patternStr2": "/^[A-Za-z\\d_]+$/g",
            "message": "请输入字母、数字、下划线组合"
          }
        ]
      },
    ],
    "buttons": ['submit', 'reset']
  },
  "children": []
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
