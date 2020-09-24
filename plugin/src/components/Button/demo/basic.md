---
order: 0
title: 按钮类型
---

- `type` 按钮类型
  - default
  - primary
  - dashed
  - danger
  - link
- `href` 跳转链接
- `useH5Href` `true`:使用h5原生跳转;`false`: 使用`history.push`跳转;默认为`false`, 通常用于下载、跳转到另外一个项目。 

```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "div",
  "props": {},
  "children": [
    {
      "type": "HtButton",
      "props": {
        "type": "primary",
        "text": "primary"
      },
      "children": []
    },
    {
      "type": "HtButton",
      "props": {
        "text": "Default"
      },
      "children": []
    },
    {
      "type": "HtButton",
      "props": {
        "type": "dashed",
        "text": "dashed"
      },
      "children": []
    },
    {
      "type": "HtButton",
      "props": {
        "type": "danger",
        "text": "danger"
      },
      "children": []
    },
    {
      "type": "HtButton",
      "props": {
        "type": "link",
        "text": "河图",
        "href": "https://hetu.com/",
        "useH5Href": true
      },
      "children": []
    }
  ]
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
