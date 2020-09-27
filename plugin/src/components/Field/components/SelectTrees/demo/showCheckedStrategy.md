---
order: 3
title: 选中数据回显策略
---

- `showCheckedStrategy` 默认为`SHOW_PARENT`
  - `SHOW_ALL`: 显示所有选中节点(包括父节点)
  - `SHOW_PARENT`: 只显示父节点(当父节点下所有子节点都选中时)
  - `SHOW_CHILD`: 只显示子节点(当父节点下所有子节点都选中时)

```jsx
import Hetu from 'hetu'

const remote = {
  treeOptions: {
    url: '/api/tree/all',
    searchField: 'key',
  },
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/api/update',
    buttons: [],
    fields: [
      {
        field: 'tree1',
        title: '全选时显示全部',
        type: 'SelectTrees',
        showCheckedStrategy: 'SHOW_ALL',
        showSearch: true,
        treeCheckable: true,
        optionsSourceType: 'dependencies',
        treeData: '<%:= treeOptions %>',
        labelField: 'title',
        valueField: 'value',
        searchConfigs: [],
      },
      {
        field: 'tree2',
        title: '全选时只显示父节点',
        type: 'SelectTrees',
        showCheckedStrategy: 'SHOW_PARENT',
        showSearch: true,
        treeCheckable: true,
        optionsSourceType: 'dependencies',
        treeData: '<%:= treeOptions %>',
        labelField: 'title',
        valueField: 'value',
        searchConfigs: [],
      },
      {
        field: 'tree3',
        title: '全选时只显示子节点',
        type: 'SelectTrees',
        showCheckedStrategy: 'SHOW_CHILD',
        showSearch: true,
        treeCheckable: true,
        optionsSourceType: 'dependencies',
        treeData: '<%:= treeOptions %>',
        labelField: 'title',
        valueField: 'value',
        searchConfigs: [],
      },
    ],
  },
  children: [],
}

ReactDOM.render(
  <Hetu elementConfig={elementConfig} remote={remote} />,
  mountNode
)
```
