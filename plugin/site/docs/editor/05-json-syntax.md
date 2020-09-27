---
category: 隐藏黑科技
order: 0
title: 模版语法
---

### 1. 字符串  `<%= %>`
`<%= %>` 是变量标识, 内部是javascript语法

`String`  
```json
当前时间 <%= new Date().toLocaleString() %>
```
### 2. 非字符串 `<%:= %>`
> `<%:= %>`相当于旧版的`${  }`  

`<%:= %>` 是变量标识, 内部是javaqscript语法. 与字符串的区别是等号前面多了一个冒号`:`

`Number`
```
<%:= 123 %> 
```

`Boolean`
```
<%:= true %> 
```

`Array`
```
<%:= [1,2,3] %> 
```

`Object`
```
<%:= {name: '***'} %> 
```

`Function`  
以下是函数的两种写法, 是等效的。
```
<%:= (a) => a+1 %>
<%:= function(a){ return a+1 } %>
```

模版字符串中的变量`作用域`为 [pagestate](/docs/editor/json-pagestate), 在控制台输入`window.$$pagestate` 可查看
