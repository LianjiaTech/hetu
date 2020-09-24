---
category: Components
type: 业务组件
title: List
subtitle: 列表
cols: 1
order: 1
---

常用于列表页。

## API

| 参数         | 说明                                                                                                  | 类型                      | 默认值                 |
| ------------ | ----------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------- |
| url          | 必填,表单提交地址                                                                                     | string                    | -                      |
| fields       | 表单字段配置, 参考 [Form fields](/components/Form/#Form-fields)                                       | array                     | -                      |
| alias        | 表单值的字段名, 用于获取搜索表单的值                                                                  | string                    | \$\$List               |
| cols         | fields 为几列布局                                                                                     | number                    | 3                      |
| labelCol     | 统一设置 Field 的 labelCol                                                                            | object                    | -                      |
| wrapperCol   | 统一设置 Field 的 wrapperCol                                                                          | object                    | -                      |
| buttons      | 列表搜索, 显示哪些按钮, 可选值有 `submit back reset otherButtons`                                     | array                     | \['submit', 'reset' \] |
| isAutoSubmit | 是否自动提交                                                                                          | boolean                   | true                   |
| pageSize     | 每一页请求数据量                                                                                      | number                    | 20                     |
| columns      | 表格列配置, 详见下方描述                                                                              | array                     | -                      |
| actionColumn | 列操作 , 详见下方描述                                                                                 | actionColumn              | -                      |
| scroll       | 表格设置横向或纵向滚动，也可用于指定滚动区域的宽和高，可以设置为像素值，百分比，true 和 'max-content' | { x: number , y: number } | -                      |
| uniqueKey    | 表格唯一标识, 之后编辑/删除等操作都是使用这个字段                                                     | string                    | id                     |
| selections   | 批量操作, 通常用于批量下载, 详情参考上文介绍                                                          | ReactNode[]               | -                      |

### List columns

表格列配置

| 属性          | 说明                                                                                | 类型                    | 默认值 |
| ------------- | ----------------------------------------------------------------------------------- | ----------------------- | ------ |
| title         | 必填,列头显示文字                                                                   | string                  | -      |
| dataIndex     | 列数据在数据项中对应的 key，支持 `a[0].b.c[1]` 的嵌套写法                           | string                  | -      |
| width         | 列宽度                                                                              | number \| string        | -      |
| tooltip       | 提示信息                                                                            | string                  | -      |
| align         | 列对齐方式                                                                          | left \| right \| center | left   |
| sort          | 排序（需要后端接收两个非必填参数，`sort:'descend''ascend',sortKey:当前排序的字段`） | boolean                 | false  |
| filterColumns | 筛选 (需要后端接收对应筛选字段`dataIndex`的参数)                                    | boolean                 | false  |

### List actionColumn operations

列表操作

| 属性      | 说明                                                                | 类型           | 默认值 |
| --------- | ------------------------------------------------------------------- | -------------- | ------ |
| text      | 必填,按钮文案                                                       | string         | -      |
| url       |  必填,表示跳转链接                                                 | string         | -      |
| fields    | 弹框表单的表单项, 参考 [Form fields](/components/Form/#Form-fields) | array          | -      |
| transform | 发送请求前, 数据格式转换, 详见下文                                  | function(data) | -      |

#### List actionColumn operations transform

uniqueKey 表格唯一标识, 编辑/删除等操作都是使用这个字段, 默认为`id`

| actionType 类型 | transform                                   | 参数含义        | 转换结果           |
| --------------- | ------------------------------------------- | --------------- | ------------------ |
| jump 或 ajax    | `"<%:=  (row) => ({ bannerId: row.id}) %>"` | row: 表格行数据 | `url?bannerId=xxx` |

记得要用`"<%:=  %>"` 包裹表达式
