---
category: 高级用法
order: 2
title: 表单联动
---

配置页面过程中, 遇到表单联动的情况, 可参考下方。

### 1. 表单值更新，如何更新其他表单的值?

例如(城市联动)：
- 选择省时, 调用接口城市下拉框选项
- 省变化时, 清空城市下拉框的值
![](https://user-gold-cdn.xitu.io/2019/11/20/16e87f01b99b90fd?w=1516&h=392&f=png&s=28458)

当我们选择第一级的时候在onChangeRequests里调用第二级的接口

```json
{
  "field": "province",
  "title": "省",
  "type": "Select",
  "options": "${provinceConfig}",
  // 当前表单值更新时, 发送http请求获取数据
  "onChangeRequests": [
    {
      // 在数据中心的变量别名, 之后可用 ${ cityList } 使用这个别名
      "alias": "cityList",
      // 请求地址
      "url": "/mock/select/city",
      // 请求方法
      "method": "get",
      // 请求参数
      "params": {
        "province": "${$$HtForm.province}"
      }
    }
  ],
  // 当前表单值变化时, 将联动的表单值(city、area)清空
  "setFieldsValue": {
    "city": [],
    "area": []
  }
}
```

![](https://user-gold-cdn.xitu.io/2019/11/20/16e87f061b907561?w=1478&h=476&f=png&s=33202)

选择第二级的时候调用第三级的接口...以此类推

```json
{
  "field": "city",
  "title": "市",
  "type": "Select",
  "options": "${ cityList }",
  "onChangeRequests": [
    {
      "alias": "areaList",
      "url": "/mock/select/area",
      "method": "get",
      "params": {
        "province": "${$$HtForm.province}",
        "city": "${$$HtForm.city}"
      }
    }
  ],
  "setFieldsValue": {
    "area": []
  }
}
```
> onChangeRequests 对应可视化编辑器中的联动属性1;  
> setFieldsValue对应联动属性2;

![](https://user-gold-cdn.xitu.io/2019/11/20/16e87f0a17411614?w=1412&h=352&f=png&s=21730)

> 注意：setFieldsValue是在选择后把内容清空

[查看Field用法](/components/Field/#用法)
