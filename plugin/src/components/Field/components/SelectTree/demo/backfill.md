---
order: 4
title: 回填格式要求
---
- 利用antd TreeSelect labelInVal特性实现回填，因此不管是单选还是多选，回填的格式都为object[]

```
[
  {
    "title": "sss",
    "value": "123"
  },{
    "title": "xxx",
    "value": "456"
  },
]
```

```jsx
import Hetu from 'hetu'
const local = {
    "list": [
      {
        "title": "ssss",
        "value": "123",
        "children": [
          {
            "title": "xxx",
            "value": "12"
          },
          {
            "title": "zzz",
            "value": "124"
          }
        ]
      }
    ]
}
const remote = {
  cityOptions: {
    url: '/api/tree/1',
    searchField: 'key',
  },
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/',
    buttons: [],
    fields: [
      {
        "field": "tree5",
        "title": "多选回显",
        "type": "SelectTree",
        "showSearch": true,
        "treeCheckable": true,
        "labelField": "title",
        "valueField": "value",
        "optionsSourceType": "dependencies",
        "searchConfigs": [
          {
            "url": "/api/tree/all",
            "searchField": "",
            "params": {},
            "transform": "<%:=  data => data %>"
          }
        ],
        "v-if": "<%:=  true %>",
        "placeholder": "",
        "tooltip": "",
        "defaultValue": [
          {
            "title": "sss",
            "value": "123"
          }
        ],
        "required": false,
        "disabled": false,
        "showCheckedStrategy": "SHOW_PARENT",
        "treeData": "<%:=  list %>"
      },
      {
        "field": "tree6",
        "title": "单选回显",
        "type": "SelectTree",
        "showSearch": true,
        "treeCheckable": false,
        "labelField": "title",
        "valueField": "value",
        "optionsSourceType": "dependencies",
        "searchConfigs": [
          {
            "url": "/api/tree/all",
            "searchField": "",
            "params": {},
            "transform": "<%:=  data => data %>"
          }
        ],
        "v-if": "<%:=  true %>",
        "placeholder": "",
        "tooltip": "",
        "defaultValue": [
          {
            "title": "sss",
            "value": "123"
          }
        ],
        "required": false,
        "disabled": false,
        "showCheckedStrategy": "SHOW_PARENT",
        "treeData": "<%:= list %>"
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
