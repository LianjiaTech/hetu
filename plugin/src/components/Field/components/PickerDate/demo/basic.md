---
order: 0
title: 基本使用
---


```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtForm",
  "props": {
    "url": "/",
    "buttons": [],
    "fields": [
      {
        "field": "month",
        "title": "月份",
        "type": "MonthPicker"
      },
      {
        "field": "week",
        "title": "周",
        "type": "WeekPicker"
      },
      {
        "field": "date",
        "title": "日期",
        "type": "DatePicker"
      },
      {
        "field": "time",
        "title": "时间",
        "type": "TimePicker"
      },
      {
        "field": "date",
        "title": "日期时间",
        "type": "DatePicker",
        "showTime": true
      },
      {
        "field": "rangeTime",
        "title": "日期范围",
        "type": "RangePicker",
        "format": "YYYY-MM-DD"
      },
      {
        "field": "rangeDate",
        "title": "时间范围",
        "type": "RangePicker"
      }
    ]
  },
  "children": []
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
