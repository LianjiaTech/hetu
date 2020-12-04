---
category: Components
type: Field 表单项
title: Checkbox
subtitle: 多选框
cols: 1
order: 4
---

[河图演示地址](http://139.155.239.172:9536/guiedit?route=%2Fproject%2Fhetu_demo%2Fhetu%2Fdemo%2FCheckbox)

多选框。

## 何时使用

- 在一组可选项中进行多项选择时；
- 在`Field`内部使用.

## API

| 参数         | 说明                     | 类型    | 默认值 |
| ------------ | ------------------------ | ------- | ------ |
| defaultValue | 默认选中的选项           | array   | \[]    |
| disabled     | 禁用状态                 | boolean | false  |
| options      | 指定可选项, 详见上文描述 | array   | \[]    |
| labelField   | options 选项的显示值     | string  | label  |
| valueField   | options 选项的表单提交值 | string  | value  |
| allCheck     | 是否开启全选             | boolean | false  |
| canAddOption | 使用允许动态添加选项     | boolean | false  |

## options

| 参数    | 说明               | 类型    | 默认值 |
| ------- | ------------------ | ------- | ------ |
| label   | 显示值             | string  | -      |
| value   | 真实值, 表单提交值 | any     | -      |
| diabeld | 是否禁用           | boolean | false  |
