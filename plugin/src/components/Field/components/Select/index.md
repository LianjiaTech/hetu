---
category: Components
type: Field 表单项
title: Select
subtitle: 单选下拉框
cols: 1
order: 6
---

[河图演示地址](http://139.155.239.172:9536/guiedit?route=%2Fproject%2Fhetu_demo%2Fhetu%2Fdemo%2FSelect)

## 何时使用

- 弹出一个下拉菜单给用户选择操作，用于代替原生的选择器，或者需要一个更优雅的多选器时。
- 当选项少时（少于 5 项），建议直接将选项平铺，使用 [Radio](/components/Field/components/Radio/) 是更好的选择。

## API

| 参数             | 说明                                                                                                                                      | 类型                                                                         | 默认值                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------- |
| options          | 指定可选项, 详见 [options](/components/Field/components/Checkbox/#options)                                                                | array                                                                        | \[]                                      |
| allowClear       | 支持清除                                                                                                                                  | boolean                                                                      | false                                    |
| defaultValue     | 指定默认选中的条目                                                                                                                        | string\|string\[]\<br />number\|number\[]\<br />LabeledValue\|LabeledValue[] | -                                        |
| disabled         | 是否禁用                                                                                                                                  | boolean                                                                      | false                                    |
| mode             | 设置 Select 的模式为多选或标签                                                                                                            | 'multiple' \| 'tags'                                                         | -                                        |
| optionFilterProp | 搜索时过滤对应的 option 属性，如设置为 children 表示对内嵌内容进行搜索。[示例](https://codesandbox.io/s/antd-reproduction-template-tk678) | string                                                                       | value                                    |
| optionLabelProp  | 回填到选择框的 Option 的属性值，默认是 Option 的子元素。比如在子元素需要高亮效果时，此值可以设为 `value`。                                | string                                                                       | `children` （combobox 模式下为 `value`） |
| placeholder      | 选择框默认文字                                                                                                                            | string                                                                       | -                                        |
| showSearch       | 使单选模式可搜索                                                                                                                          | boolean                                                                      | false                                    |
