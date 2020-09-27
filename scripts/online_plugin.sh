#!/bin/bash

source ./scripts/util.sh

ENV=$1

if [ ! -n "$ENV" ]; then
    ENV="test"
fi

echo "开始打包plugin, 打包环境为 $ENV"

rm -rf ./dist/plugin
rm -rf ./plugin/dist
mkdir -p dist/plugin

echo "install deps"
cd ./plugin 
npm install --registry=https://registry.npm.taobao.org/
echo "build source"
npm run build:umd

echo "build success"
cd ..

cp -R -f plugin/dist/* dist/plugin/
echo "build end"

echo "push source"
scp -r dist/plugin/* $ACCOUNT:/data/www/hetu-plugin
echo "push success"
