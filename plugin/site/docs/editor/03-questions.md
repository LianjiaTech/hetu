---
category: 详细教程
order: 7
title: 七.常见问题
---

以下整理了一些 在配置河图页面的过程中，经常会提出的问题。

#### Q：配置接口时要注意什么?

A：接口前面需要加上`项目唯一标识`，例如："/hetu/xxx/xxx"，并且在项目配置里`请求状态的字段、请求成功状态码、提示信息字段`都要与接口格式对应上。

#### Q：remote 里的请求该怎么写?

A：
![](https://user-gold-cdn.xitu.io/2020/5/12/17206b7e944063e5?w=500&h=324&f=png&s=104280)

```
"remote": {
  "projectDetail": {
    "url": "/api/department/list", // 请求的接口
    "params": {                        //  给接口传递的参数
      "id": "xxx",
    },
    "transform": "<%:= v => v.list %>"    //  数据格式的转换
  }
},
```

#### Q：页面 url 跳转参数该怎么传过去?

A：地址代表要跳转过去的页面 url，"<%:= v => ({ projectId: v.id}) %>"把 projectId 当参数传递给页面 url。
![](https://user-gold-cdn.xitu.io/2020/3/25/1711085ac3a6f2d2?w=544&h=80&f=png&s=9183)
![](https://user-gold-cdn.xitu.io/2020/3/25/17110863dadcadc8?w=538&h=216&f=png&s=18561)

#### Q：如何获取页面 url 中的查询参数?

A：

```
"transform": "<%:= data => ({...data, projectId: location.query.projectId}) %>"
```

#### Q：Table 某一字段怎么动态展示?

A：

```
"render": "<%:= v => v === 'xxx' ? '你好' : '再见' %>"
```

#### Q：Select 设置的`valueField`没有生效?

A: `valueField` 字段名不能为"key"

#### Q：Select 下拉框怎么在 remote 配置 里获取数据?

A：在 select 的 optionsDependencies 里用"<%:= selectOptions %>"，optionsSourceType 设置为`dependencies`。

<img src="https://user-gold-cdn.xitu.io/2020/5/18/1722702ee8774713?w=560&h=512&f=png&s=104256"
style="width: 200px">

```
"remote": {
    "selectOptions": {
      "url": "/xxx/xxx/xxx"
    }
  },
```

#### Q：Select 下拉框怎么在 自定义 里获取数据?

A：在 select 的 optionsSourceType 设置为`remote`，optionsConfig 里请求接口。

<img src="https://user-gold-cdn.xitu.io/2020/5/18/17227031ac33d06b?w=518&h=958&f=png&s=170571"
style="width: 200px">

```
"optionsSourceType": "remote",
"optionsConfig": {
    "url": "/mock/api/sugs"
  }
```

#### Q：表单联动怎么配置?

A：详细见[表单联动](http://139.155.239.172/docs/editor/06-senior-form)

#### Q：模糊搜索怎么配置?

A：首先在 remote 里请求接口，`选项数据来源和在remote中的字段`的配置如下图所示。

```
"remote": {
    "departmentOptions": {
      "url": "/api/department/list"
    }
  },
```

![](https://user-gold-cdn.xitu.io/2020/3/25/17110c72759a0e7f?w=542&h=166&f=png&s=15466)
![](https://user-gold-cdn.xitu.io/2020/3/25/17110c78cd1776d7?w=546&h=176&f=png&s=13481)

#### Q：怎么判断一个量是不是 undefined?

A：

```
"transform": "<%:= v => ({...v, logo: v.logo ? [v.logo] : undefined }) %>"
```

#### Q：怎样快速克隆一个页面?

A：
<img src="https://user-gold-cdn.xitu.io/2020/3/25/17110cf03f407eec?w=728&h=190&f=png&s=17387"
style="width: 400px">
<img src="https://user-gold-cdn.xitu.io/2020/3/25/17110d25a4527c67?w=1044&h=690&f=png&s=54084"
style="width: 400px">

#### Q：日期框时间格式转换?

A：moment 可以直接使用

```
moment(text).format('YYYY-MM-DD HH:mm:ss')
```

#### Q：显示 or 隐藏表格列字段?

A：用`"v-if": "<%:= true %>"`来控制，true 为显示，false 为隐藏，如需动态展示可以写三元运算符。

#### Q：正则检验怎么配置?

A：
![](https://user-gold-cdn.xitu.io/2020/4/2/17139a5a7038240e?w=2848&h=1306&f=png&s=889877)

#### Q：列表里的链接怎么用新窗口打开?

A：
```
"customRender": "<%:= v => v!== '' && _C('a', { href: v, target: '_blank'}, '预览') %>"
```

#### Q：列表的`total`总数显示不正确?

A：将`total`改成接口返回的字段

<img src="https://user-gold-cdn.xitu.io/2020/5/22/1723b16ef555a3c3?w=538&h=444&f=png&s=84281"
style="width: 300px">

#### Q：Alert组件的字符串拼接怎么写? 例如 `46（119/261）`

A：
```
  "description": "<%:= xxx.a + '（ '+ xxx.b + '/' + xxx.c +' ）' %>",
```

#### Q：日期怎么设置默认值? 例如（当前日期之前的14天）

A:
```
  "defaultValue": "<%:= moment().subtract(14,'days').format('YYYY-MM-DD') %>",
```

#### Q：禁用日期怎么设置? 例如（当前日期之后的日期不可选）

A:
```
  "disabledDate": "<%:= current => current && current > moment().endOf('day') %>"
```

> 会不定期更新文档，收集大家提出的问题。
