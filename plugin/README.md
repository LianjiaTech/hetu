河图组件库

## 本地开发
```
# 进入plugin目录
cd ./plugin

# 安装依赖
yarn

# 打包输出esm模块
yarn build

# 安装文档依赖
cd ./site & yarn

# 启动文档服务
yarn start
```

## 编辑器调试
```
打包输出umd模块
yarn build:umd

# 启动静态服务, 
yarn start:dist 
```

打开 [河图页面](http://139.155.239.172:9536), 同时打开Chrome调试工具面板, 在`Local Storage`中设置
> `hetu-cdn-public` 为`http://127.0.0.1:8888` 

刷新页面, 查看`network`面板, 看到已经加载了本地资源
![](https://user-gold-cdn.xitu.io/2020/5/14/17212a5ba3e0be89?w=2184&h=678&f=png&s=210751)
