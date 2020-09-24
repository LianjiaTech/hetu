---
order: 4
title: 任意级联动
---

### 何时使用

当数据量较大时使用, 数据量较小时, 建议使用 [SelectCascade](/components/Field/components/SelectCascade/)

### 用法

- 在`setFieldValues`中能够拿到`onChangeRequests` 请求数据完的结果.
- `onChangeRequests` 当表单值变化时, 发送请求获取数据 格式如下

```
{
  alias: string  // 挂载到全局(pagestate)的字段名
  url: string    // 请求地址
  method?: string  // 请求方法, 默认为get
  params?: JsonSchema.DynamicObject  // get请求参数
  data?: JsonSchema.DynamicObject // post请求参数
  transform?: (v: JsonSchema.DynamicObject) => JsonSchema.DynamicObject // 响应数据处理
}[]
```

- `setFieldValues` 当表单值变化时, 通过该字段, 来更新其他表单的值。setFieldsValue 的格式为

```
{
    field: string,
    value: (v, res) => any
}[]
```

- field 为表单项的 key
- value
  - 如果为函数`<%:= (v, res) => ({}) %>`, 参数`v`即为当前表单的值, res 表示 onChangeRequests 的返回值;
  - 如果为其他类型, 则直接返回。

```jsx
import Hetu from 'hetu'

// 静态数据
const local = {
  business_group_options: [],
  business_line_options: [],
}

// 远程数据
const remote = {
  business_direction: {
    url: '/api/business/direction',
  },
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/api/form/update',
    fields: [
      {
        title: '级联选择 / 任意级联动',
        type: 'Divider',
        orientation: 'left',
      },
      {
        field: 'business_direction',
        title: '业务方向',
        type: 'Select',
        onChangeRequests: [
          {
            alias: 'business_group_options',
            url: '/api/business/group',
            method: 'get',
            params: {
              business_direction: '<%:= $$HtForm.business_direction %>',
            },
            transform: '<%:= v => v %>',
          },
        ],
        setFieldValues: [
          {
            field: 'business_group',
            value: null,
          },
          {
            field: 'business_line',
            value: null,
          },
        ],
        placeholder: '',
        tooltip: '',
        required: true,
        disabled: false,
        showSearch: false,
        optionsSourceType: 'dependencies',
        labelField: 'label',
        valueField: 'value',
        optionsDependencies: '<%:= business_direction %>',
      },
      {
        field: 'business_group',
        title: '业务组',
        type: 'Select',
        onChangeRequests: [
          {
            alias: 'business_line_options',
            url: '/api/business/line',
            method: 'get',
            params: {
              business_group: '<%:= $$HtForm.business_group %>',
            },
            transform: '<%:= v => v %>',
          },
        ],
        setFieldValues: [
          {
            field: 'business_line',
            value: null,
          },
        ],
        placeholder: '',
        tooltip: '',
        required: true,
        disabled: false,
        showSearch: false,
        optionsSourceType: 'dependencies',
        labelField: 'label',
        valueField: 'value',
        optionsDependencies: '<%:= business_group_options %>',
      },
      {
        field: 'business_line',
        title: '业务线',
        type: 'Select',
        options: '<%:= business_line_options %>',
        placeholder: '',
        tooltip: '',
        required: true,
        disabled: false,
        showSearch: false,
        optionsSourceType: 'dependencies',
        labelField: 'label',
        valueField: 'value',
        optionsDependencies: '<%:= business_line_options %>',
        onChangeRequests: [],
      },
    ],
    buttons: ['submit', 'reset'],
  },
  children: [],
}

ReactDOM.render(
  <Hetu elementConfig={elementConfig} local={local} remote={remote} />,
  mountNode
)
```
