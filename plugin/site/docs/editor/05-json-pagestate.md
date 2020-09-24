---
category: 隐藏黑科技
order: 4
title: pagestate
subtitle: 数据中心
---

`pagestate`是整个页面的`数据中心`(类似 redux 的 store),也是整个页面的变量`作用域`。

`pagestate`由河图底层 JSON 渲染器生成,存放在内存中,可以通过`window.$$pageState`在控制台打印,基本格式如下:

可用属性

### 1. location

> 拓展的`window.location`对象,做了`query`解析

例如: 页面 url 为`http://xxx-xxx.com/project/xxx/review/list?id=123`,
通过`location.query.id` 可以获取浏览器中的查询参数 id `123`

### 2. userInfo

> 用户信息

```json
{
  "create_tiem": 1598604654,
  "email": "*******@163.com",
  "id": 1234,
  "name": "****"
}
```

### 3. projectDetail

> 项目信息

![](https://user-gold-cdn.xitu.io/2020/3/20/170f6b82d42b2c1d?w=700&h=934&f=png&s=410620)

### 4. moment

> 时间格式工具, 可在控制台输入`window.$$pagestate.moment`进行测试

#### 4.1 字符串转时间戳

```jsx
moment('2020-03-12').valueOf() // 1583942400000
```

#### 4.2 时间戳转换成自定义格式

- `Y` 年
- `M` 月
- `D` 日
- `H` 小时
- `m` 分钟
- `s` 秒

```jsx
moment(1583942400000).format('YYYY-MM-DD') // "2020-03-12"
moment(1583942400000).format('YYYY-MM-DD HH:mm') // "2020-03-12 00:00"
moment(1583942400000).format('YYYY-MM-DD HH:mm:ss') // "2020-03-12 00:00:00"
```

#### 4.3 7 天以前

```jsx
moment()
  .subtract(7, 'days')
  .format('YYYY-MM-DD') // "2020-03-13"
```

#### 4.4 7 天之后

```jsx
moment()
  .add(7, 'days')
  .format('YYYY-MM-DD') // "2020-03-27"
```

更多请查看 [moment](http://momentjs.cn/)

### 5. \_C

> [React.createElement](https://reactjs.org/docs/react-api.html#createelement) 的别名, 用于创建一个`React.Node`节点

#### 5.1 创建一个 html 原生标签

```jsx
<a href="http://hetu.com">河图</a>
```

#### 5.2 创建一个 antd 组件

```jsx
// 通过window.$$componentMap查看所有支持的组件
_C('Tag', { color: '#108ee9'}, '河图')

// 相当于
<Tag color="#108ee9">河图</Tag>
```
