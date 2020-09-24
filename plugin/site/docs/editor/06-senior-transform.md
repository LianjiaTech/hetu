---
category: 高级用法
order: 4
title: 数据格式转换
---

## 何时使用

transform 是一个箭头函数, 用于的数据格式转换, 下面介绍几种常用的数据格式**转换的场景**

### 1. 页面配置 remote 格式转换

请求响应格式转换, 例如: 获取项目详情

```json
{
  "remote": {
    "projectDetail": {
      "url": "/xxx/api/xxx",
      "params": {},
      "transform": "${ data => data.list[0] }"
    }
  }
}
```

后端大佬返回的数据格式如下

```json
{
  "status": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "name": "我的第一个项目"
      }
    ]
  }
}
```

转换后的 projectDetail 的格式如下

```json
{
  "projectDetail": {
    "id": 1,
    "name": "我的第一个项目"
  }
}
```

### 2. 表单提交前格式转换

适用于 `HtForm HtModalForm HtList`  
例如, 表单数据如下

```json
{
  "name": "xxx",
  "age": 28
}
```

希望提交表单时, 带上 url 中的查看参数`projectId`, 则可配置为

```json
{
  "type": "HtForm",
  "props": {
    "transform": "${data => ({...data, projectId: location.query.projectId }) }"
  }
}
```

`() => ({})` 是 es6 箭头函数, 相当于 `function(){ return {} }`

### 3. 列表操作数据格式转换

适用于 `HtList`的列表操作`operations`配置, 如下图所示, [查看详情](/components/List/#components-List-demo-transform)

![](https://user-gold-cdn.xitu.io/2019/7/4/16bbc08bcb7c5a0b?w=572&h=215&f=png&s=22882)
