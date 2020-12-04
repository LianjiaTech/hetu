---
category: Components
type: Field 表单项
title: Radio
subtitle: 单选框
cols: 1
order: 2
---

[河图演示地址](http://139.155.239.172:9536/guiedit?route=%2Fproject%2Fhetu_demo%2Fhetu%2Fdemo%2FRadio)

单选框。

## 何时使用

- 在一组可选项中进行单项选择时；
- 在`Field`内部使用.

## API

### 属性

#### Radio

| 参数         | 说明                                                      | 类型                   | 默认值 |
| ------------ | --------------------------------------------------------- | ---------------------- | ------ |
| defaultValue | 默认选中的选项                                            | string                 | -      |
| disabled     | 禁用状态                                                  | boolean                | false  |
| options      | 指定可选项, 详见 [options](/components/Checkbox/#options) | array                  | \[]    |
| labelField   | options 选项的显示值                                      | string                 | label  |
| valueField   | options 选项的表单提交值                                  | string                 | value  |
| value        | 指定选中的选项                                            | string                 | -      |
| onChange     | 变化时回调函数                                            | Function(checkedValue) | -      |
