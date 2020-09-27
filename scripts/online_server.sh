#!/bin/bash

source ./util.sh

ENV=$1

if [ ! -n "$ENV" ]; then
    ENV="test"
fi

echo "开始打包server, 打包环境为 $ENV"

rm -rf ./dist/server
rm -rf ./server/dist
mkdir -p dist/server

echo "install server deps"
cd ./server 
npm install --registry=https://registry.npm.taobao.org/

echo "build source"
npm run build
echo "build success"
cd ..

cp -R -f server/* dist/server/
rm -rf dist/server/dist/system_config.ini
rm -rf dist/server/dist/public/index.html
cp -R -f dist/client/index.html dist/server/dist/public/index.html

echo "build end"

echo "push source"
scp -rC dist/server/* $ACCOUNT:/data/www/hetu-server/
echo "push success"
