import { Editor } from '~/types'

let a: Editor.BaseProperties = {
  title: {
    title: '卡片标题',
    type: 'string',
    defaultValue: '卡片标题',
  },
  bordered: {
    title: '是否有边框',
    type: 'bool',
    defaultValue: true,
  },
  extra: {
    title: '右上角按钮',
    type: 'json',
    height: 400,
  },
}

export default a
