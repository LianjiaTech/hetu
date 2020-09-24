---
category: Components
type: Field 表单项
title: TableEditor
subtitle: 可编辑的表格
cols: 1
order: 14
---

## 何时使用

需要编辑`Array<Object>`类型的数据时

## API

| 参数           | 说明                                 | 类型    | 默认值 |
| -------------- | ------------------------------------ | ------- | ------ |
| defaultValue   | 表单默认值,详见下文                  | array   | -      |
| columns        | 表格列配置                           | array   | -      |
| canAdd         | 是否允许动态添加                     | boolean | true   |
| canAddChildren | 是否允许动态添加子元素, 最多添加一级 | boolean | false  |

## columns

| 参数      | 说明                                                                   | 类型             | 默认值 |
| --------- | ---------------------------------------------------------------------- | ---------------- | ------ |
| title     | 列标题                                                                 | string           | -      |
| dataIndex | 列字段                                                                 | string           | -      |
| width     | 列宽度                                                                 | string \| number | -      |
| type      | 表单类型,可选值参考[Field 表单项](/components/Field/components/Input/) | string           | Input  |
| required  | 是否必填                                                               | boolean          | false  |
| disabled  | 是否禁用                                                               | boolean          | false  |

其他更复杂的表单属性配置, 参考[Field 表单项](/components/Field/components/Input/)
