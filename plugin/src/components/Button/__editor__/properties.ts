/* eslint-disable no-template-curly-in-string */
import { Editor, JsonSchema } from '~/types'
let config = (formDate: JsonSchema.DynamicObject): Editor.BaseProperties => {
  let linkTarget = {}
  if (formDate.type === 'link') {
    linkTarget = {
      linkTarget: {
        title: '新开窗口',
        type: 'bool',
        defaultValue: false,
      },
    }
  }
  return {
    href: {
      title: '跳转地址',
      type: 'string',
    },
    text: {
      title: '按钮文案',
      type: 'string',
    },
    type: {
      title: '按钮类型',
      type: 'enum',
      enumList: ['default', 'primary', 'dashed', 'danger', 'link'],
      enumDescriptionList: ['default', 'primary', 'dashed', 'danger', 'link'],
      defaultValue: 'default',
    },
    ...linkTarget,
    useH5Href: {
      title: 'href跳转',
      desc: '用于下载时,开启',
      type: 'bool',
      defaultValue: false,
    },
  }
}

export default config
