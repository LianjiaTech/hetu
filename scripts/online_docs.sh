#!/bin/bash

source ./util.sh

ENV=$1

if [ ! -n "$ENV" ]; then
    ENV="test"
fi

echo "开始打包docs, 打包环境为 $ENV"

rm -rf ./dist/site
rm -rf ./plugin/_site
mkdir -p dist/site

echo "install components deps"
cd ./plugin
npm install --registry=https://registry.npm.taobao.org/
echo "build components"
npm run build
echo "build components success"

echo "install site deps"
cd ./site 
npm install --registry=https://registry.npm.taobao.org/
echo "build site source"
npm run build

echo "build success"
cd ../..

cp -R -f plugin/_site/* dist/site/
echo "build end"

echo "push source"
scp -r dist/site/* $ACCOUNT:/data/www/hetu-doc
echo "push success"
