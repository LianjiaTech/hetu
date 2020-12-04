# 服务器部署

## 🍼 准备
1. 一台云服务器
2. 申请3个域名, 例如
  - node服务 beike.plus
  - cdn服务 cdn.beike.plus
  - 文档服务 doc.beike.plus
  
在购买的域名控制台上, 配置域名解析规则, 将这3个域名分别指向前面申请的云服务机IP地址

## 📦 安装Nginx
配置EPEL源
```
sudo yum install -y epel-release
sudo yum -y update
```
安装nginx
```
sudo yum install -y nginx
```

启动nginx
```
systemctl start nginx
```

设置开机启动
```shell
systemctl enable nginx
```
详情见 [Centos 7下安装配置Nginx
](https://developer.aliyun.com/article/699966)

## 🔨 配置Nginx

进入nginx配置目录
```
cd /etc/nginx/conf.d/
```

创建配置文件
```
touch hetu-cdn.conf hetu-doc.conf hetu-server.conf
```

### hetu-cdn.conf 配置
```
server {
    listen      80;
    server_name cdn.beike.plus
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

### hetu-doc.conf 配置
```
server {
    listen      80;
    server_name doc.beike.plus;
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


### hetu-server.conf 配置
```
server {
    listen      80;
    server_name beike.plus;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://127.0.0.1:9536;
    }
}
```

### 重启nginx
检测配置文件是否正确
```
nginx -t
```
重启nginx
```
nginx -s reload
```

打开 http://139.155.239.172/ 预览文档服务

## 👝 创建资源文件夹

创建静态资源目录
```shell
# 创建用于存放静态资源的目录
mkdir -p /data/www

# 进入
cd /data/www/

# 创建4个文件夹, 用于存放对应资源
mkdir hetu-client hetu-doc hetu-plugin hetu-server
```

创建项目配置文件 system_config.ini
```ini
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

## 🧶 推送代码
> 退出远程服务器, 进入本地开发根目录

修改根目录下配置文件`system_config.ini`, 增加以下配置
```ini
[ssh]
ssh_ip = ******             // 云服务器ip 
ssh_user = ******           // 云服务器登录账号 

[client]
cdn_host = cdn.beike.plus  // 静态资源CDN, 例如`cdn.beike.plus`
```

推送组件库
```
sh scripts/online_plugin.sh
```

推送组件库文档
```
sh scripts/online_docs.sh
```
推送完之后, 可打开文档服务域名进行预览

推送client
```
sh scripts/online_client.sh
```

推送server
```
sh scripts/online_server.sh
```

## 🚀 启动node服务
### 1. 在centos上安装node.js

从 nodejs 官网下载 [*-linux-x64.tar.x](https://nodejs.org/dist/latest-erbium/) 为后缀的二进制安装包, 解压后使用：

```
# 下载nodejs二进制文件
wget https://nodejs.org/dist/v12.18.3/node-v12.18.3-linux-x64.tar.xz
```

解压到`/usr/local/lib/nodejs`文件夹
```
# 创建文件夹
sudo mkdir -p /usr/local/lib/nodejs
# 解压到指定文件夹
sudo tar xJvf node-v12.18.3-linux-x64.tar.xz -C /usr/local/lib/nodejs     
```

设置环境变量，在 `~/.profile` 文件下面添加如下代码
```
# Nodejs
VERSION=v12.18.3
DISTRO=linux-x64
export PATH=/usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin:$PATH
```

刷新`~/.profile`, 让配置生效
```
source ~/.profile
```

测试是否生效
```
node -v

# v12.18.3
```

### 2. 使用pm2启动node服务
pm2是node进程管理工具, 利用它可以简化很多node应用管理的繁琐任务，如性能监控、自动重启、负载均衡等。

进入node服务目录
```
cd /data/www/hetu-server
```

全局安装
```
sudo npm i -g pm2
```

启动一个名为hetu的node服务, --watch意味着文件变化, 就会重新启动服务
```
pm2 start dist/app.js --watch --name 'hetu'
```

设置开机启动
```
pm2 start up
```

查看当前node服务进程
```
pm2 list
```

查看hetu日志
```
pm2 log hetu
```

在浏览器打开 http://139.155.239.172:9536/ 进行预览
