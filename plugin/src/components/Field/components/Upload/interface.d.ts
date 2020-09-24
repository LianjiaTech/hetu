import { UploadProps } from 'antd/es/upload'
import { UploadFile } from 'antd/es/upload/interface'
import { BaseProps } from '~/types'

export interface IPrivateOptions {
  // 服务云申请
  Bucket: string
}

export declare type UploadListType = 'text' | 'picture' | 'picture-card'

export interface UploadConfig extends UploadProps {
  listType?: UploadListType
  filename?: string
}

export type HtUploadValue = string | string[]

export interface HtUploadProps extends BaseProps {
  value: HtUploadValue
  onChange: (v: string[]) => void
  // 是否禁用
  disabled?: boolean
  // 最大上传数量
  max?: number
  // 图片上传宽度
  width?: number
  // 最大上传高度
  height?: number
  // 最大上传尺寸
  maxSize?: number
  // 是否添加签名访问
  isPrivate?: boolean
  // 私有上传配置
  privateConfig?: IPrivateOptions
  // 其他配置
  uploadProps: UploadConfig
}

export type HtUploadFile = Partial<UploadFile>

export interface HtUploadState {
  previewVisible: boolean
  previewImage?: string
  fileList: HtUploadFile[]
  isInit: boolean
  privateOptions: IPrivateOptions
}
