---
order: 0
title: 基本用法
---

- `max` 设置最大的上传数量
- `maxSize` 最大上传尺寸(kb)
- `width` 上传图片宽度(px)
- `height` 上传图片高度(px)
- `isPrivate` 是否使用带签名访问
- `privateConfig` 带签名访问配置
  - `Bucket` 文件存储桶, 默认为`hetu-private`
- `uploadProps`
  - `action` 上传地址
  - `accept` 上传文件格式, 例如图片格式`.jpg, .bmp, .png`, excel 格式`.xlsx, .xls`

![](https://user-gold-cdn.xitu.io/2020/4/27/171b99a923cd894f?w=1293&h=500&f=png&s=276529)

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/api/form/update',
    fields: [
      {
        field: 'file',
        title: '上传图片',
        type: 'Upload',
        extra: '最多上传2张图片',
        max: 2,
        maxSize: 10000,
        "isPrivate": false,
        "privateConfig": {
          "Bucket": "hetu-private"
        },
        defaultValue: [],
        uploadProps: {
          action: '/api/upload',
          accept: '.jpg, .bmp, .png, .pdf',
          listType: 'picture',
        }
      },
      {
        field: 'file1',
        title: '上传excel',
        type: 'Upload',
        defaultValue: [],
        "isPrivate": false,
        "privateConfig": {
          "Bucket": "hetu-private"
        },
        uploadProps: {
          action: '/api/upload/excel',
          accept: '.xlsx, .xls',
          listType: 'text',
        },
        rules: []
      },
    ],
  },
  children: [],
}
ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
