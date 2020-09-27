#!/bin/bash

source ./scripts/util.sh

ENV=$1

if [ ! -n "$ENV" ]; then
    ENV="test"
fi

echo "开始打包client, 打包环境为 $ENV"

rm -rf ./dist/client
rm -rf ./client/dist
mkdir -p dist/client

echo "install deps"
cd ./client
npm install --registry=https://registry.npm.taobao.org/
echo "build source"
npm run build
echo "build success"
cd ..

cp -R -f client/dist/* dist/client/
echo "build end"

echo "push source"
scp -r dist/client/* $ACCOUNT:/data/www/hetu-client
echo "push success"
