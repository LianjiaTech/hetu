---
category: Components
type: 业务组件
title: Form
subtitle: 表单
cols: 1
order: 2
---

[河图演示地址](http://139.155.239.172:9536/guiedit?route=%2Fproject%2Fhetu_demo%2Fhetu%2Fdemo%2Fform)

## 何时使用

通常作为一个单独的页面使用, 用于数据创建、数据编辑。

## API

| 属性             | 说明                                                                                                    | 类型                     | 默认值              |
| ---------------- | ------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------- |
| url              | 必填,表单提交地址                                                                                       | string                   | -                   |
| fields           | 表单字段配置, [参考](/components/Field/)                                                                | array                    | -                   |
| alias            | 表单值的字段名, 用于访问当前表单的值                                                                    | string                   | \$\$HtForm          |
| transform        | 发送请求前, 数据格式转换, 详见下文                                                                      | function(data)           | -                   |
| cols             | fields 为几列布局, 共 24 列                                                                             | number                   | 1                   |
| labelCol         | label 标签布局，同 Col 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12} | object                   | -                   |
| wrapperCol       | 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol                                               | object                   | -                   |
| buttons          | 列表搜索, 显示哪些按钮, 可选值有 `submit back reset` 或`ReactNode`, 数组的顺序, 即按钮的顺序            | array<string\|ReactNode> | \['back','submit'\] |
| submitButtonText | submit 按钮的文案                                                                                       | String                   | 提交                |
| backButtonText   | back 按钮的文案                                                                                         | String                   | 返回                |
| resetButtonText  | reset 按钮的文案                                                                                        | String                   | 重置                |
| onSuccessAction  | 请求成功回调行为, 可选值有`redirectTo: 跳转地址 | goBack | reload | trigger: 事件名`                    | String                   | -                   |

### transform

发送请求前, 数据格式转换。下面是一个格式转换的例子

```
// 例如表单原始数据为:
{
  name: '章三',
  sex: 1
}

// data为表单原始值
{
  transform: (data) => ({ ...data, id: 'xxx'})
}

// 则表单提交值为
{
  id: 'xxx',
  name: '章三',
  sex: 1
}
```
