// app/service/s3.js
import AWS, { S3 } from 'aws-sdk'
import mimeTypes from 'mime-types'

const dev =  {
  accessKeyId: '',
  secretAccessKey: '',
  region: '',
  bucket: '',
  s3BucketEndpoint: true,
  s3ForcePathStyle: true,
  endpoint: '',
}

//  AWS 配置
const envConfig: { [index: string]: S3.Types.ClientConfiguration & { bucket: string } } = {
  default: dev,
  test: dev,
  prod: dev,
}

let s3: S3
const getS3Instance = (s3Config: S3.Types.ClientConfiguration) => {
  if (s3) return s3
  // 修改默认配置
  s3 = new AWS.S3(s3Config)
  return s3
}
class S3Service {
  /**
   *
   * @param originalname 原始文件名, 用于判断文件类型, 没有匹配到对应文件则不指定文件类型
   * @param name 上传文件名
   * @param file 上传文件的内容
   */
  static async upload(originalname: string, name: string, file: S3.Body) {
    let realEnv = 'prod'
    const s3Config = envConfig[realEnv]

    let mime = mimeTypes.contentType(originalname)
    let uploadConfig: S3.PutObjectRequest = {
        Bucket: s3Config.bucket,
        Key: name,
        Body: file,
    }
    if (mime) {
      uploadConfig['ContentType'] = mime
    }
    let instance = getS3Instance(s3Config)

    return await instance.upload(uploadConfig).promise()
  }
}

export default S3Service
