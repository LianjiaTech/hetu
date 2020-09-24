---
category: Components
type: 业务组件
title: Field
subtitle: 表单项
cols: 1
order: 3
---

`Field`作为`Form`的配置项, 用来配置表单项。

## 何时使用

作为组件`Form`的 fields 配置项

## API

| 属性             | 说明                                                                                                    | 类型    | 默认值 |
| ---------------- | ------------------------------------------------------------------------------------------------------- | ------- | ------ |
| field            | 必传,表单提交字段                                                                                       | string  | -      |
| defaultValue     | 默认值                                                                                                  | any     | -      |
| title            | 标题                                                                                                    | string  | -      |
| required         | 是否必填                                                                                                | boolean | false  |
| rules            | 表单校验规则                                                                                            | array   | -      |
| tooltip          | 提示信息                                                                                                | string  | -      |
| type             | 表单类型, 可选值参考 [Field 表单项](/components/Field/components/Checkbox/)                             | string  | Input  |
| placeholder      | 默认提示                                                                                                | string  | -      |
| disabled         | 表单是否禁用                                                                                            | boolean | false  |
| options          | 可选项, 配置[参考](/components/Field/components/Checkbox/#options)                                      | Array   | -      |
| ignore           | 表单提交时, 忽略表单值                                                                                  | boolean | false  |
| labelCol         | label 标签布局，同 Col 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12} | object  | -      |
| wrapperCol       | 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol                                               | object  | -      |
| setFieldValues   | 表单值变化时, 设置一组输入控件的值                                                                      | Array   | -      |
| onChangeRequests | 表单值变化时, 发送请求                                                                                  | Array   | -      |
| triggerOnChanges | 表单变化时, 触发自定义事件                                                                              | Arrar   | -      |



## 表单项变化时, 联动属性
调用顺序为`onChangeRequests --> setFieldValues --> triggerOnChanges`

### 1. onChangeRequests 当前表单值变化时, 发送请求
数据格式为: 
```json
[
  {
    "event": "onChange",  // 触发类型, 可选值有onChange, onBlur
    "alias": "xxxDetail", // 返回数据, 挂载到数据中心的别名
    "url": "****",        // 请求资源地址
    "method": "get",      // 请求方法, 可选值有get、post
    "params": {},         // 请求参数
    "transform": "<%:=  res => res %>" // 对请求数据进行处理
  }
]
```

### 2. setFieldValues 当前表单值变化时, 更新其他表单项的值
在这一步能够获取onChangeRequests的结果。
数据格式为: 
```json
[
  {
    "event": "onChange",  // 触发类型, 可选值有onChange, onBlur
    "field": "***",       // 待更新字段
    "value": "<%:=  (changeVal, posts) => changeVal %>" // 更新字段的方法, changeVal: 是当前表单的值; posts: 是onChangeRequests的接口返回值, 是一个数组
  }
]
```

### 3. triggerOnChanges 当前表单值变化时, 触发自定义事件
数据格式为: 
```json
[
  {
    "event": "onChange",                // 触发类型, 可选值有onChange, onBlur 
    "triggerName": "HtList.search" // 触发的事件名
  }
]
```
