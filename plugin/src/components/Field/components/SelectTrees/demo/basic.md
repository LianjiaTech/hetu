---
order: 1
title: 基本用法-单选/多选
---

通过treeCheckable控制单选/多选

```jsx
import Hetu from 'hetu'

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
        field: 'tree1',
        title: '树选择器-单选',
        type: 'SelectTrees',
        showSearch: true,
        treeCheckable: false,
        labelField: 'title',
        valueField: 'value',
        defaultValue: [],
        optionsSourceType: "all",
        searchConfigs: [
          {
            url: '/api/tree/all',
            searchField: 'key',
          }
        ],
      },{
        "field": "tree2",
        "title": "树选择器-多选",
        "type": "SelectTrees",
        "showSearch": true,
        "treeCheckable": true,
        "labelField": "title",
        "valueField": "value",
        "optionsSourceType": "all",
        "searchConfigs": [
          {
            "url": "/api/tree/all",
            "searchField": "key"
          }
        ]
      }
    ],
  },
  children: [],
}

ReactDOM.render(
  <Hetu elementConfig={elementConfig} remote={remote} />,
  mountNode
)
```
