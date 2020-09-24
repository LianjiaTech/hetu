---
order: 5
title: 保存数据格式
---

- 不管是单选还是多选，保存的格式都为object[]
- optionsSourceType为async时，利用异步加载特性可以支持保存节点路径
```
[
  {
    "title": "大区2",
    "value": "110000>>>shiyebu1>>>daqu2"
  }
]
```

```jsx
import Hetu from 'hetu'
const local = {
    
}
const remote = {
  
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/',
    buttons: [],
    fields: [
      {
        "field": "tree7",
        "title": "异步加载可以保存父子关系",
        "type": "SelectTree",
        "showSearch": true,
        "treeCheckable": true,
        "labelField": "title",
        "valueField": "value",
        "optionsSourceType": "async",
        "searchConfigs": [
          {
            "url": "/api/tree/1",
            "searchField": "key",
            "params": {},
            "transform": "<%:= data => data %>"
          },
          {
            "url": "/api/tree/2",
            "searchField": "key",
            "params": {},
            "transform": "<%:= data => data %>"
          },
          {
            "url": "/api/tree/3",
            "searchField": "",
            "params": {},
            "transform": "<%:= data => data %>"
          }
        ],
        "v-if": "<%:= true %>",
        "placeholder": "",
        "tooltip": "",
        "defaultValue": [{
           "title": "大区2",
           "value": "110000>>>shiyebu1>>>daqu2"
         }],
        "required": false,
        "disabled": false,
        "showCheckedStrategy": "SHOW_PARENT",
        "nodePath": true,
        "splitTag": ">>>"
      }
    ],
  },
  children: [],
}

ReactDOM.render(
  <Hetu elementConfig={elementConfig} local={local} remote={remote} />,
  mountNode
)
```
