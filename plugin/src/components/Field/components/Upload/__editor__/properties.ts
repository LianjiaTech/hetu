import _ from 'lodash'
import BaseProperty from '~/components/Field/types/baseProperty'
import { Editor, JsonSchema } from '~/types/index'

export default (_formData: JsonSchema.DynamicObject): Editor.BaseProperties => {
  let _baseProperty = _.cloneDeep(BaseProperty)

  return {
    ..._.omit(_baseProperty, [
      'placeholder',
      'required',
      'disabled',
      'defaultValue',
    ]),
    defaultValue: {
      title: '默认值',
      type: 'json',
      defaultValue: [],
    },
    max: {
      title: '最大数量',
      desc: '最大上传的文件数量',
      type: 'number',
      defaultValue: 1,
    },
    maxSize: {
      title: '最大尺寸',
      desc: '上传的文件的最大尺寸, 单位kb',
      type: 'number',
    },
    width: {
      title: '文件宽度',
      desc: '上传的宽度, 单位px',
      type: 'number',
    },
    height: {
      title: '文件高度',
      desc: '上传的高度, 单位px',
      type: 'number',
    },
    required: BaseProperty.required,
    disabled: BaseProperty.disabled,
    isPrivate: {
      title: '带签名访问',
      desc: '敏感信息应该带签名访问',
      type: 'bool',
      defaultValue: false,
    },
    privateConfig: {
      visible: !!_formData.isPrivate,
      title: '其他配置',
      type: 'object',
      properties: {
        Bucket: {
          title: 'Bucket',
          desc: '默认使用河图的Bucket',
          type: 'string',
          defaultValue: 'hetu-private',
        },
      },
    },
    uploadProps: {
      title: '其他配置',
      type: 'object',
      properties: {
        accept: {
          title: '文件类型',
          desc: '接受上传的文件类型,逗号分隔',
          type: 'string',
          defaultValue: '.jpg,.jpeg,.png',
        },
        listType: {
          title: '展示类型',
          type: 'enum',
          defaultValue: 'text',
          enumList: ['text', 'picture-card', 'picture'],
          enumDescriptionList: ['text', 'picture-card', 'picture'],
        },
        action: {
          title: '上传地址',
          desc: '上传的地址',
          type: 'string',
          defaultValue: '/api/upload',
        },
        filename: {
          title: '自定义文件名',
          type: 'string',
          defaultValue: '',
        },
      },
    },
  }
}
