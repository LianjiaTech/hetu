---
category: 隐藏黑科技
order: 3
title: pageconfig
subtitle: 页面配置
---

## 页面渲染流程

![](https://user-gold-cdn.xitu.io/2020/3/20/170f6f3871384aec?w=1666&h=422&f=png&s=92720)

页面配置包含以下字段, 可在可视化编辑器中查看、修改

> 进入到河图编辑器，如下图所示点击 JSON 编辑，即可修改以下字段配置。

![](https://user-gold-cdn.xitu.io/2020/3/27/1711b7a9473cae62?w=1346&h=130&f=png&s=22199)
![](https://user-gold-cdn.xitu.io/2020/3/27/1711b7ae7053d32e?w=1264&h=374&f=png&s=50552)

## route

> 页面路由, 格式为 `/project/项目唯一标识/xxx/xx`

## title

> 页面标题

## local

> 静态变量

例如, 某个下拉框选项数据,是静态数据, 在页面中多个地方都用到, 可配置在 local 中, 避免多次配置

```jsx
{
  "local": {
    "xxxOptions": [
      {
        "label": "北京",
        "value": 110000
      }
    ]
  }
}
```

在页面中可通过`<%:= xxxOptions %>`获取值

### remote

> 远程数据获取

```jsx
// remote配置示例
{
  "remote": {
    "xxxDetail": {
      "url": "/项目唯一标识/api/agent/detail",
      "method": "get",
      "params": {
        "id": "<%:= location.query.id %>"
      },
      "transform": "<%:= data => data %>"
    }
  }
}
```

在页面中可通过`<%:= xxxDetail %>`获取接口返回值

#### remote API

- `url` 必填, 请求地址, 格式为`项目唯一标识+接口地址`  
   例如XXX的项目唯一标识为`bkf`,XXX的业务方后端接口地址为`/list/role`, 则 url 配置为`/bkf/list/role`
- `method` 请求方法, 默认为`get`
- `params` 请求参数
- `transform` 请求响应数据格式处理, [参考](/docs/editor/faq-defaultValue)

#### remote 解析过程

假设

- 项目唯一标识为 `bkf`,
- 项目的接口转发地址为``
- 浏览器 url 为`http://139.155.239.172:9536/bkf/xxx/list?id=1234`

1. 浏览器发送 `/bkf/api/agent/detail?id=1234` 到河图 node 中间层`http://139.155.239.172`

2. node 中间层`http://139.155.239.172:9536` 解析 url, 拿到项目唯一标识`bkf`, 根据这个标识, 将请求转发到``, 并携带自定义`header`信息

3. node 中间层发送`/api/agent/detail?id=1234`的请求, 假设响应结果为

```json
{
  "status": 0,
  "message": "success",
  "data": {
    "id": 1,
    "name": "我的第一个项目"
  }
}
```

node 中间层再把请求响应结果转发给浏览器

4. 在浏览器中, 河图拿到响应结果, 并把响应结果存到数据中心

```json
{
  "xxxDetail": {
    "id": 1,
    "name": "我的第一个项目"
  }
}
```

### onRemoteResolved
当remote解析完成后的回调钩子

在这里可以对页面渲染做拦截, 例如跳转到其他页面
```json
"onRemoteResolved": "<%:= pagestate => window.location.replace('/abc') %>"
```


### elementConfig

> 页面 DOM 节点配置
