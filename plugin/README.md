河图组件库

## 本地开发
```
# 安装依赖
npm install

# 打包输出esm模块
npm run build

# 安装文档依赖
cd ./site & npm install

# 启动文档服务
npm start
```

## 编辑器调试
```
打包输出umd模块
npm run build:umd

# 启动静态服务, 
npm run start:dist 
```
打开河图测试页面,同时打开Chrome调试工具面板, 在`Local Storage`中设置
> `hetu-cdn-public` 为`http://127.0.0.1:8080` 

其中`3.1.45`为本地dist目录下面文件夹,即版本号
![](https://user-gold-cdn.xitu.io/2020/5/14/17212a023dc3f908?w=2190&h=378&f=png&s=75051)

刷新页面, 查看`network`面板, 看到已经加载了本地资源
![](https://user-gold-cdn.xitu.io/2020/5/14/17212a5ba3e0be89?w=2184&h=678&f=png&s=210751)

## 集成到自己的项目
...待完善
