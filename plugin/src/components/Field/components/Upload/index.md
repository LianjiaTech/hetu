---
category: Components
type: Field 表单项
title: Upload
subtitle: 文件上传
cols: 1
order: 10
---

[河图演示地址](http://139.155.239.172:9536/guiedit?route=%2Fproject%2Fhetu_demo%2Fhetu%2Fdemo%2FUpload)

通用文件上传服务, 可上传 图片、文件等, 已支持带签名访问。

## API

| 参数          | 说明               | 类型          | 默认值 |
| ------------- | ------------------ | ------------- | ------ |
| isPrivate     | 是否添加签名访问   | boolean       | false  |
| privateConfig | 带签名访问配置     | privateConfig | -      |
| max           | 最大上传数量       | number        | 1      |
| maxSize       | 最大尺寸(kb)       | number        | -      |
| width         | 上传图片宽度(px)   | number        | -      |
| height        | 上传图片高度(px)   | number        | -      |
| uploadProps   | 上传配置, 详见下文 | object        | -      |

## privateConfig
| 参数   | 说明       | 类型   | 默认值         |
| ------ | ---------- | ------ | -------------- |
| Bucket | 文件存储桶 | string | 'hetu-private' |


## uploadProps

| 参数     | 说明                                                                                                                           | 类型    | 默认值 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ | ------- | ------ |
| accept   | 接受上传的文件类型, 详见 [input accept Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) | string  | 无     |
| action   | 上传的地址                                                                                                                     | string  | -      |
| disabled | 是否禁用                                                                                                                       | boolean | false  |

## 参考资料
> ⚠️⚠️ aws-sdk 包体积非常大(压缩后>2M), 建议将签名算法放在后端实现。
* [AWSJavaScriptSDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property)
* [Using Query Parameters](https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-query-string-auth.html)
