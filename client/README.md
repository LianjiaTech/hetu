### package.json

文件目录结构:
```bash
.
├── dist
│   └── 编译输出
├── config
│   └── webpack配置文件
├── public
│   └── 全局性静态资源
├── scripts
│   └── webpack打包脚本
├── src
│   ├── types
│   │   └── 类型声明文件, 路径和实际文件对应路径保持一致
│   ├── constant
│   │   └── 项目常量
│   ├── common
│   │   └── router.js
│   │       └── 项目路由
│   ├── components
│   │   │   └── 组件库
│   │   └── _utils
│   │       └── 组件内公用函数库
│   ├── pageConfigs
│   │   └── 静态页面模板
│   ├── routes
│   │   └── 编辑器路由
│   ├── assets
│   │   └── 组件内静态资源
│   ├── decorators
│   │   └── 装饰器,用于读取propType属性, 目前已废弃
│   ├── libraries
│   │   └── editor
│   │       └── redskull2依赖文件, 安装时自动生成
│   ├── models
│   │   └── dva中所用model
│   └── utils
│       └── 全局公用函数库
└── test
    └── __mocks__


```
