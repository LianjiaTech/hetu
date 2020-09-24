---
order: 2
title: optionsSourceType
---

这个属性是为了方便可视化编辑器编辑

- `optionsSourceType` 数据类型, 可选值有`'static' | 'dependencies'`, 默认值为`static`

optionsDependencies和options均为下拉框选项配置
- `options` 当`optionsSourceType=static`时,生效
- `optionsDependencies`  当`optionsSourceType=dependencies`时,生效

```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtForm",
  "props": {
  "url": "/",
    "buttons": [],
    "fields": [
      {
        "field": "sex",
        "title": "性别",
        "type": "Radio",
        "canAddOption": true,
        "optionsSourceType": "static",
        "options": [
          "男",
          "女"
        ]
      },
      {
        "field": "sex",
        "title": "是否禁用",
        "type": "Radio",
        "optionsSourceType": "dependencies",
        "optionsDependencies": [
          {
            "label": "是",
            "value": 1
          },
          {
            "label": "否",
            "value": 0
          }
        ]
      }
    ]
  },
  "children": [],
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
