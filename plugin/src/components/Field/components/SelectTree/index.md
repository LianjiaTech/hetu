---
category: Components
type: Field 表单项
title: SelectTree
subtitle: 树选择器
cols: 1
order: 8
---

[河图演示地址](http://139.155.239.172:9536/guiedit?route=%2Fproject%2Fhetu_demo%2Fhetu%2Fdemo%2FSelectTree)

## 何时使用

类似 Select 的选择控件，可选择的数据结构是一个树形结构时，可以使用 SelectTree，例如公司层级、学科系统、分类目录等等。

## 与 SelectCascade 的区别

- 支持选择任意层级, 例如 `省-市-区` 级联选择, 可以选择 `省`、`省-市`、`省-市-区`
- 支持单选和多选

## API

| 参数                | 说明                                                       | 类型                              | 默认值     |
| ------------------- | ---------------------------------------------------------- | --------------------------------- | ---------- |
| defaultValue        | 默认值,例：\[{"title":"显示"， "value":"值"}\]             | object[]                          | []         |
| disabled            | 是否禁用                                                   | boolean                           | false      |
| treeCheckable       | 是否允许多选                                               | boolean                           | false      |
| showSearch          | 是否显示搜索框                                             | boolean                           | false      |
| showCheckedStrategy | 数据回显策略, 详情见上文                                   | SHOW_ALL\|SHOW_CHILD\|SHOW_PARENT | SHOW_CHILD |
| searchConfigs       | ajax 请求配置                                              | searchConfig[]                    | []         |
| optionsSourceType   | option 加载方式                                            | all\|async\|dependencies          | all        |
| nodePath            | optionsSourceType 为 async 时保存的 value 是否携带父子关系 | boolean                           | true       |
| splitTag            | value 中父子 id 分隔符                                     | string                            | >>>        |

## searchConfig

| 参数        | 说明           | 类型          | 默认值 |
| ----------- | -------------- | ------------- | ------ |
| url         | 必填, 请求地址 | string        | --     |
| params      | 默认请求参数   | object        | -      |
| searchField | 表单提交字段   | string        | 'key'  |
| transform   | 表单值转换     | (v:any) => [] | -      |

## treeDataItem

| 参数       | 说明                   | 类型              | 默认值 |
| ---------- | ---------------------- | ----------------- | ------ |
| title      | 必填, 树节点显示的内容 | string\|ReactNode | '---'  |
| value      | 必填, 表单提交值       | string            | -      |
| selectable | 非必填,是否可选        | boolean           | false  |
| disabled   | 非必填,是否禁用        | boolean           | false  |
| searchable | 非必填,是否点击搜索    | boolean           | false  |
| children   | 非必填,子节点          | treeDataItem[]    | []     |
