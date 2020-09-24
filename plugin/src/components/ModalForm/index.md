---
category: Components
type: 业务组件
title: ModalForm
subtitle: 弹框表单
cols: 1
order: 4
---

弹框表单, 支持所有的`Form`组件属性. 除此之外, 还有一些特定属性。

## API

表单部分的配置, 与`Form`一致, 以下展示`Modal`部分的配置。

| 参数               | 说明                                                                         | 类型   | 默认值          |
| ------------------ | ---------------------------------------------------------------------------- | ------ | --------------- |
| title              | 弹框标题                                                                     | string | -               |
| triggerButtonText  | 触发弹框显示, 按钮的文案                                                     | string | -               |
| triggerButtonProps | 按钮的属性                                                                   | object | -               |
| alias              | 表单值的字段名, 用于访问当前表单的值                                         | string | \$\$HtModalForm |
| onSuccessAction    | 请求成功回调行为, 可选值有`redirectTo: 跳转地址 | goBack | reload | trigger` | String | -               |
| width              | 设置弹窗的宽度                                                               | number | 416             |
