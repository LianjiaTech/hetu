---
category: 接入必看
order: 1
title: 接口规范
---

## 请求响应格式
> 数据格式一致, 字段可配置。

```
{
    status: 0,
    message: "success",
    data: { ... }
}
```

| 字段    | 数据类型 | 必填 | 说明                                                                                                                                                  |
| ------- | -------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| status  | number   | 必传 | 表示接口请求状态, 可选值为: <br/>`0`: 请求成功; <br/> `1`: 请求失败; <br/> `403`: 无权限; <br/> `408`: 未登录,将跳转到登录页 ;<br/> `500`: 服务器错误 |
| message | string   | 必传 | 消息提示                                                                                                                                              |
| data    | object   | 可选 | 返回数据                                                                                                                                              |


## `content-type`

`get/post` 请求 默认均为 `application/json`, 可修改为其他。

### 列表页的接口格式
> `必须` 带分页参数

**request**
[/demo/getList?pageNum=1&pageSize=20](/demo/getList?pageNum=1&pageSize=20)

| 字段     | 数据类型 | 说明     |
| -------- | -------- | -------- |
| pageNum  | number   | 第 n 页  |
| pageSize | number   | 每页条数 |

其他查询参数, 例如 field1, 可以拼接在 url 后面

**response**

```
{
    status: 0,
    message: '请求成功',
    data:{
        list: [...],
        total: 100
    }
}
```

将数据放在 data 中返回, 按照以下格式:

| 字段  | 数据类型 | 说明       |
| ----- | -------- | ---------- |
| total | number   | 数据总条数 |
| list  | array    | 数据列表   |

### 创建/更新/删除

**request**
method => POST

示例

```
接口地址
/hetu/project/add

提交数据结构
{
    name:'河图',
    comment:'备注'
}
```

### 获取下拉框选项
> label、value字段可配置
```
{
    "status": 0,
    "message": "ok",
    "data": [
        {
            "label": "北京",
            "value": 110000
        }
    ]
}
```

