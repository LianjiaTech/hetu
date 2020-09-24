---
order: 2
title: option加载方式
---

optionsSourceType有三种加载方式：
- all: 一次加载（接口加载整个树结构，searchConfigs只需要配置1个接口）
- async: 异步加载（searchConfigs可以配置一个通用接口通过参数加载每个层级，也可以配置多个接口加载不同层级）
- dependences: 依赖加载(从local、remote、pagestate中变量中获取)


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
    url: '/mock/api/tree/1',
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
        "field": "tree1",
        "title": "全部接口加载",
        "type": "SelectTrees",
        "showSearch": true,
        "treeCheckable": true,
        "labelField": "title",
        "valueField": "value",
        "optionsSourceType": "all",
        "searchConfigs": [
          {
            "url": "/mock/api/tree/all",
            "searchField": "",
            "params": {},
            "transform": "<%:= data => data %>"
          }
        ],
        "v-if": "<%:= true %>",
        "placeholder": "",
        "tooltip": "",
        "defaultValue": [],
        "required": false,
        "disabled": false,
        "showCheckedStrategy": "SHOW_PARENT"
      },
      {
        "field": "tree2",
        "title": "异步加载通用接口",
        "type": "SelectTrees",
        "showSearch": true,
        "treeCheckable": true,
        "labelField": "title",
        "valueField": "value",
        "optionsSourceType": "all",
        "searchConfigs": [
          {
            "url": "/mock/api/tree/all",
            "searchField": "key",
            "params": {},
            "transform": "<%:= data => data %>"
          }
        ],
        "v-if": "<%:= true %>",
        "placeholder": "",
        "tooltip": "",
        "defaultValue": [],
        "required": false,
        "disabled": false,
        "showCheckedStrategy": "SHOW_PARENT"
      },
      {
        "field": "tree3",
        "title": "异步加载多接口",
        "type": "SelectTrees",
        "showSearch": true,
        "treeCheckable": true,
        "labelField": "title",
        "valueField": "value",
        "searchConfigs": [
          {
            "url": "/mock/api/tree/1",
            "searchField": "key",
            "params": {},
            "transform": "<%:= data => data %>"
          },
          {
            "url": "/mock/api/tree/2",
            "searchField": "key",
            "params": {},
            "transform": "<%:= data => data %>"
          },
          {
            "url": "/mock/api/tree/3",
            "searchField": "key",
            "params": {},
            "transform": "<%:= data => data %>"
          },
          {
            "url": "/mock/api/tree/4",
            "searchField": "key",
            "params": {},
            "transform": "<%:= data => data %>"
          }
        ],
        "v-if": "<%:= true %>",
        "placeholder": "",
        "tooltip": "",
        "defaultValue": [],
        "required": false,
        "disabled": false,
        "showCheckedStrategy": "SHOW_PARENT",
        "nodePath": true,
        "optionsSourceType": "async",
        "splitTag": ">>>",
        "dependencies": "<%:= cityList %>",
        "treeData": "<%:= list %>"
      },
      {
        "field": "tree4",
        "title": "依赖加载",
        "type": "SelectTrees",
        "showSearch": true,
        "treeCheckable": true,
        "labelField": "title",
        "valueField": "value",
        "optionsSourceType": "dependencies",
        "searchConfigs": [
          {
            "url": "/mock/api/tree/all",
            "searchField": "",
            "params": {},
            "transform": "<%:= data => data %>"
          }
        ],
        "v-if": "<%:= true %>",
        "placeholder": "",
        "tooltip": "",
        "defaultValue": [],
        "required": false,
        "disabled": false,
        "showCheckedStrategy": "SHOW_PARENT",
        "treeData": "<%:= list %>"
      },
    ],
  },
  children: [],
}

ReactDOM.render(
  <Hetu elementConfig={elementConfig} local={local} remote={remote} />,
  mountNode
)
```
