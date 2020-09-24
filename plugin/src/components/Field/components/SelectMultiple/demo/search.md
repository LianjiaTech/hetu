---
order: 0
title: 搜索
---

- `showSearch` 显示搜索框
- `remote`是否为远程搜索
  
**远程搜索配置**  
- `searchOnFocus` 聚集时, 是否触发搜索
- `optionsConfig` 远程搜索配置
  - `field` 搜索提交字段, 默认`keyLike`
  - `url` 搜索地址
  - `params` get请求默认参数

```jsx
import Hetu from 'hetu'

const fields = [
  {
    "field": "hobbies",
    "title": "模糊搜索",
    "type": "SelectMultiple",
    "showSearch": true,
    "placeholder": "输入关键字搜索",
    "options": [
      {
        "label": "骑马",
        "value": 1
      },
      {
        "label": "射箭",
        "value": 2
      },
      {
        "label": "摔跤",
        "value": 3
      }
    ]
  },
  {
    "field": "remotehobbies",
    "title": "远程搜索",
    "type": "SelectMultiple",
    "labelField": "name",
    "tooltip": "searchOnFocus为true",
    "showSearch": true,
    "searchOnFocus": true,
    "placeholder": "输入关键字搜索",
    "remote": true,
    "optionsSourceType": 'remote',
    "optionsConfig": {
      "url": "/api/sugs"
    }
  }
]


const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/',
    buttons: [],
    fields,
  },
  children: [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
