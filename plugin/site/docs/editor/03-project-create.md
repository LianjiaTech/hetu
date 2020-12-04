---
category: 详细教程
order: 1
title: 一.创建项目
---

### 1. 进入河图后台 [http://139.155.239.172:9536](http://139.155.239.172:9536)

点击右上角`新建项目`

<img src="https://user-gold-cdn.xitu.io/2020/5/18/17225b26d8f928b4?w=1026&h=842&f=png&s=143140"
style="width: 500px">

### 2.找到创建的项目, 点击编辑

![](https://user-gold-cdn.xitu.io/2020/5/18/17225c8df0a518d1?w=2344&h=408&f=png&s=208705)

### 3. 修改接口转发地址、请求状态码等

![](https://user-gold-cdn.xitu.io/2020/3/20/170f71fdc354a555?w=1580&h=1294&f=png&s=125192)

#### 3.1 测试接口转发是否配置成功

假设你的项目唯一标识为`aaa`,其中一个接口为 `/api/xxx/list`
在浏览器中输入`http://139.155.239.172:9536/aaa/api/xxx/list`, 可以查看接口转发信息, 请求失败时, 返回格式如下

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/067211a54e0840feb70b27735d277f38~tplv-k3u1fbpfcp-zoom-1.image)

### 4. 配置导航菜单

> 可配置一级、二级菜单, 先创建页面, 再配置菜单

- `path` 页面路由
- `name` 显示名称
- `icon` 图标, 可不填. [可选icon](https://3x.ant.design/components/icon-cn/)
- `children` 子菜单 

#### 配置示例
```json
[
  {
    "path": "/project/hetu-display/list",
    "name": "分类1",
    "icon": "ordered-list",
    "children": [
      {
        "path": "/project/hetu-display/list/1",
        "name": "子菜单1"
      },
      {
        "path": "/project/hetu-display/list/2",
        "name": "子菜单2"
      }
    ]
  },
  {
    "path": "/project/hetu-display/form",
    "name": "分类2"
  }
]
```

效果预览  
![](https://user-gold-cdn.xitu.io/2020/7/24/1737fb6cbcc80131?w=251&h=196&f=png&s=6228)

⚠️⚠️ 注意

- 二级菜单路径应该包含一级菜单的路径

```
/aaa/bbb 一级菜单
/aaa/bbb/ccc 二级菜单
```

- 导航菜单在 iframe 中不会生效
