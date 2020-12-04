---
category: Components
type: Field 表单项
title: Input
subtitle: 输入框
cols: 1
order: 0
---

[河图演示地址](http://139.155.239.172:9536/guiedit?route=%2Fproject%2Fhetu_demo%2Fhetu%2Fdemo%2FInput)

## 何时使用

`Input`需要在`Field`内部使用.

## API

### Input

| 参数         | 说明                       | 类型    | 默认值 |
| ------------ | -------------------------- | ------- | ------ |
| defaultValue | 输入框默认内容             | string  |        |
| disabled     | 是否禁用状态，默认为 false | boolean | false  |
| placeholder  | 引导文案                   | string  | -      |

### Input.TextArea

多行文本框

| 参数 | 说明       | 类型   | 默认值 |
| ---- | ---------- | ------ | ------ |
| rows | 显示为几行 | number | -      |

### Input.Password

密码输入框
