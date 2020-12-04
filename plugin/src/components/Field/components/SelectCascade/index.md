---
category: Components
type: Field 表单项
title: SelectCascade
subtitle: 级联选择
cols: 1
order: 8
---

[河图演示地址](http://139.155.239.172:9536/guiedit?route=%2Fproject%2Fhetu_demo%2Fhetu%2Fdemo%2FSelectCascade)

## 何时使用

需要从一组相关联的数据集合进行选择，例如省市区，公司层级，事物分类等。

从一个较大的数据集合中进行选择时，用多级分类进行分隔，方便选择。

比起 Select 组件，可以在同一个浮层中完成选择，有较好的体验。

## 与 SelectTree 的区别

- 只支持选择到最后一级, 例如 `省-市-区` 级联选择, 必须选择 `省-市-区` 才能提交
- 不支持多选

## API

| 参数         | 说明     | 类型     | 默认值 |
| ------------ | -------- | -------- | ------ |
| defaultValue | 默认值   | string[] | -      |
| options      | 下拉选项 | Option[] | -      |

### Option

```
interface Option {
  label: string;
  value: string;
  searchable?: boolean
  disabled?: boolean;
  children?: Option[];
}
```

| 参数       | 说明        | 类型                        | 默认值 |
| ---------- | ----------- | --------------------------- | ------ |
| label      | 必传,显示值 | string                      | -      |
| value      | 必传,真实值 | string \| number \| boolean | -      |
| searchable | 开启搜索    | boolean                     | false  |
| disabled   | 是否禁用    | boolean                     | false  |
| children   | 子节点      | Option                      | -      |
