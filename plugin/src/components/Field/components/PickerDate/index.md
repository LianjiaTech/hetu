---
category: Components
type: Field 表单项
title: DatePicker
subtitle: 日期选择器
cols: 1
order: 9
---

[河图演示地址](http://139.155.239.172:9536/guiedit?route=%2Fproject%2Fhetu_demo%2Fhetu%2Fdemo%2FDatePicker)

输入或选择日期的控件。

## 何时使用

当用户需要输入一个日期，可以点击标准输入框，弹出日期面板进行选择。

## API

以下 API 为 DatePicker、MonthPicker、RangePicker, WeekPicker 共享的 API。

| 参数        | 说明                                                                                               | 类型                   | 默认值       |
| ----------- | -------------------------------------------------------------------------------------------------- | ---------------------- | ------------ |
| disabled    | 禁用                                                                                               | boolean                | false        |
| placeholder | 输入框提示文字                                                                                     | string\|RangePicker\[] | -            |
| size        | 输入框大小，`large` 高度为 40px，`small` 为 24px，默认是 32px                                      | string                 | 无           |
| format      | 设置日期格式，为数组时支持多格式匹配，展示以第一个为准。配置参考 [moment.js](http://momentjs.com/) | string \| string[]     | "YYYY-MM-DD" |

### DatePicker

| 参数         | 说明                                                                               | 类型                           | 默认值                                             |
| ------------ | ---------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------- |
| disabledTime | 不可选择的时间                                                                     | function(date)                 | 无                                                 |
| defaultValue | 默认日期，如果开始时间或结束时间为 `null` 或者 `undefined`，日期范围将是一个开区间 | [moment](http://momentjs.com/) | 无                                                 |
| mode         | 日期面板的状态                                                                     | `time|date|month|year|decade`  | 'date'                                             |
| showTime     | 增加时间选择功能                                                                   | Object\|boolean                | [TimePicker Options](/components/time-picker/#API) |
| showToday    | 是否展示“今天”按钮                                                                 | boolean                        | true                                               |

### MonthPicker

| 参数   | 说明                                                       | 类型   | 默认值    |
| ------ | ---------------------------------------------------------- | ------ | --------- |
| format | 展示的日期格式，配置参考 [moment.js](http://momentjs.com/) | string | "YYYY-MM" |

### WeekPicker

| 参数   | 说明                                                       | 类型   | 默认值    |
| ------ | ---------------------------------------------------------- | ------ | --------- |
| format | 展示的日期格式，配置参考 [moment.js](http://momentjs.com/) | string | "YYYY-wo" |

### RangePicker

| 参数         | 说明                 | 类型                                                                                                                     | 默认值                                             |
| ------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| disabledTime | 不可选择的时间       | function(dates: \[moment, moment\], partial: `'start'|'end'`)                                                            | 无                                                 |
| format       | 展示的日期格式       | string                                                                                                                   | "YYYY-MM-DD HH:mm:ss"                              |
| ranges       | 预设时间范围快捷选择 | { \[range: string]: [moment](http://momentjs.com/)\[] } \| { \[range: string]: () => [moment](http://momentjs.com/)\[] } | 无                                                 |
| separator    | 设置分隔符           | string                                                                                                                   | '~'                                                |
| showTime     | 增加时间选择功能     | Object\|boolean                                                                                                          | [TimePicker Options](/components/time-picker/#API) |
