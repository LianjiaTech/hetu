---
category: Components
type: 业务组件
title: Button
subtitle: 按钮
cols: 1
---

按钮用于开始一个即时操作。

## 何时使用

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。


## API

| 属性      | 说明                                                                  | 类型    | 默认值  |
| --------- | --------------------------------------------------------------------- | ------- | ------- |
| disabled  | 按钮失效状态                                                          | boolean | `false` |
| href      | 点击跳转的地址，指定此属性 button 的行为和 a 链接一致                 | string  | -       |
| text      | 按钮文案                                                              | string  | -       |
| useH5Href | 是否使用h5原生跳转, 默认会使用`history.push`优化跳转,避免页面跳转闪烁 | boolean | false   |
 

