<p align="center">
<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9202d4d9e234092881b110c5bfeee7c~tplv-k3u1fbpfcp-zoom-1.image" width="60" height="60"/>
<h1>河图</h1>
</p>

河图, 是一个 `低代码` 平台, 通过可视化界面, 快速生成各种后台页面, 极大减少开发成本。

河图是贝壳找房内部孵化项目, 目前已在公司大多数业务线落地, 完成200+项目, 1500+页面。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c879472eac3a4e65806f7b18e188d112~tplv-k3u1fbpfcp-zoom-1.image)

## ✨ 特性
- 🚴‍♀️ 操作简单、功能强大的可视化编辑器
- 📦 开箱即用、高质量后台管理系统模版
- ⚙️ 开发流程全部线上化，节省沟通、调试、运维成本
- 🛡 使用 React、TypeScript、nodejs、express 开发


## 🖥 兼容环境  
- 现代浏览器、IE11以上。

## 🔗 链接
- [文档](http://doc.beike.plus/)
- [首页](http://beike.plus/)

## 🍼 开发前准备
### 1. 一台云开发机
用于代码部署

### 2. 一个邮箱账号
需要[开启SMTP服务](https://juejin.im/post/6867430619635744776/), 用于发送验证码

### 3. MySQL数据库
可选择以下两种方式,部署MySQL服务
  - [手动部署MySQL数据库](https://help.aliyun.com/document_detail/116727.html)
  - 购买MySQL云服务

将`server/open_hetu.sql`文件, 导入到数据库

## ⚒ 搭建服务

### 第一步 创建配置文件
在`/server/src`目录下创建`system_config.ini`文件, 配置内容如下

```ini
[ssh]
ssh_ip = ******     // 云服务器ip 
ssh_user = ******   // 云服务器登录账号 

[client]
cdn_host = ******   // 静态资源CDN, 例如`cdn.beike.plus`

[server]
port = 9536         // node服务启动端口

[mysql]             // mysql配置
host = ****
port = ****
user = ****
password = ****
database = ****

[email]
host = smtp.163.com // SMTP服务域名
port = 364          // 连接端口
user = ****         // 公共邮箱账号
pass = ****         // 授权密码
```

### 第二步 部署组件库和文档
- `/plugin` 目录下的内容为组件库
- `/plugin/site` 目录下的内容为组件库文档

#### 1. 打包部署

在云服务器上创建文件夹, 用于放静态资源
```shell
cd /data/www/

# 创建文件夹, 用于存放静态资源
mkdir hetu-client hetu-doc hetu-plugin hetu-server

# 创建配置文件, 内容见上一步
touch system_config.ini
```

#### 2. 配置 nginx
如果没有安装nginx, 需要先 [安装nginx](https://developer.aliyun.com/article/699966)

```shell
# 进入nginx配置目录
cd /etc/nginx/conf.d/

# 创建配置文件
touch hetu-cdn.conf hetu-doc.conf hetu-server.conf
```

申请3个域名, 例如 河图node服务`xxx.com`、cdn静态资源服务`cdn.xxx.com`、文档服务`doc.xxx.com`, 将这3个域名分别指向前面申请的云开发机ip, 配置如下:

##### hetu-cdn.conf 配置
```nginx
server {
    listen      80;
    server_name cdn.xxx.com;
    root  /data/www/;

    gzip                    on;
    gzip_http_version       1.1;
    gzip_buffers            256 64k;
    gzip_comp_level         5;
    gzip_min_length         1000;
    gzip_proxied            expired no-cache no-store private auth;
    gzip_types              text/plain application/javascript application/x-javascript t
ext/css application/xml text/javascript application/vnd.ms-fontobject font/ttf font/open
type font/x-woff;

    gzip_disable "MSIE 6";

    if ( $request_method !~ GET|POST|HEAD ) {
        return 403;
    }

    location ^~ /hetu-plugin/ {
        add_header 'Access-Control-Allow-Origin'  '*';
        alias /data/www/hetu-plugin/;
    }

    location ^~ /hetu-client/ {
        add_header 'Access-Control-Allow-Origin'  '*';
        alias /data/www/hetu-client/;
    }
}
```

##### hetu-doc.conf 配置

```nginx
server {
    listen      80;
    server_name doc.xxx.com;
    root  /data/www/hetu-doc;

    gzip                    on;
    gzip_http_version       1.1;
    gzip_buffers            256 64k;
    gzip_comp_level         5;
    gzip_min_length         1000;
    gzip_proxied            expired no-cache no-store private auth;
    gzip_types              text/plain application/javascript application/x-javascript t
ext/css application/xml text/javascript application/vnd.ms-fontobject font/ttf font/open
type font/x-woff;

    gzip_disable "MSIE 6";

    if ( $request_method !~ GET|POST|HEAD ) {
        return 403;
    }

    location / {
        index index.html index.htm;
        if (!-f $request_filename) {
            rewrite ^/(.*)$ /index.html?/$1 last;
            break;
        }
    }
}
```

##### hetu-server.conf 
```nginx
server {
    listen      80;
    server_name xxx.com;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://127.0.0.1:9536;
    }
}
```

重启nginx
```shell
# 检测配置文件是否正确
nginx -t

# 重启nginx
nginx -s reload
```

- 打开 `http://doc.xxx.com` 预览文档服务  
- 打开 `http://cdn.xxx.com/hetu-plugin/manifest.json` 预览静态资源服务

### 第三步 安装项目依赖
```shell
# server
cd ./server && npm install

# client
cd ../client && npm install
```

### 第四步 开始开发
```shell
# client
cd ./client && npm start
# server
cd server && npm run dev
```

> 打开`127.0.0.1:1234`预览

![](https://file.ljcdn.com/hetu-cdn/hetu-display-index-1598618209.png)


### 第五步 打包部署
```shell
# 打包 && 部署client 
sh online_client.sh

# 打包 && 部署server
sh online_server.sh
```
### 第六步 在云服务器上启动node服务

#### 在centos上安装node.js
EPEL（Extra Packages for Enterprise Linux）企业版Linux的额外软件包，是Fedora小组维护的一个软件仓库项目，为RHEL/CentOS提供他们默认不提供的软件包。
```
# 先确认系统是否已安装epel-release包
yum info epel-release 

# 若已安装, 则跳过
sudo yum install epel-release

# 安装nodejs
sudo yum install nodejs

# 查看node版本
node -v
```

#### 使用pm2启动node服务
pm2是node进程管理工具, 利用它可以简化很多node应用管理的繁琐任务，如性能监控、自动重启、负载均衡等。

```
# 全局安装
sudo npm i -g pm2

# 启动一个名为hetu的node服务, --watch意味着文件变化, 就会重新启动服务
pm2 start dist/app.js --watch --name 'hetu'

# 设置开机启动
pm2 start up

# 保存当前进程状态
pm2 save

# 查看当前node服务进程
pm2 list
```

## 版本记录

[CHANGELOG](/CHANGELOG.md)

## 问题咨询
- QQ群 【河图开源交流】 1046702822

## 主要贡献者

| Name                                     | Avatar                                                                                                     | Name                                     | Avatar                                                          | Name                                   | Avatar                                                                                                    | Name                                      | Avatar                                                                                                     | Name                               | Avatar                                                                                                     |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [好爸爸](https://github.com/good-father) | ![](https://avatars0.githubusercontent.com/u/18495604?s=40&u=9c52375b23eb3eb0402922cabb1cb90e910fc943&v=4) | [嘻老师](https://github.com/aa978563552) | ![](https://avatars0.githubusercontent.com/u/61268325?s=40&v=4) | [姚泽源](https://github.com/YaoZeyuan) | ![](https://avatars3.githubusercontent.com/u/7150325?s=40&u=8fb766237479748224c4425c4badd436872fcc12&v=4) | [liaoqixin](https://github.com/liaoqixin) | ![](https://avatars1.githubusercontent.com/u/39083857?s=40&u=bdc30ac0690d258bff8053d91e7ee114891de6fe&v=4) | [般若超](https://github.com/WISZC) | ![](https://avatars2.githubusercontent.com/u/37796897?s=40&u=fe779bfa82b95da9bbc39eb33bfa3ab239969e07&v=4) |


## License

[MIT](http://opensource.org/licenses/MIT)

Copyright(c) 2020 Lianjia, Inc. All Rights Reserved

