import { Editor } from '~/types'
import map from './default_value'

const options: Editor.AdditablePropertiesOption[] = [
  {
    label: '文字',
    icon: 'read',
    value: map.text,
  },
  {
    label: '链接',
    icon: 'paper-clip',
    value: map.a,
  },
  {
    label: '图片',
    icon: 'file-image',
    value: map.img,
  },
  {
    label: '开关',
    icon: 'switcher',
    value: map.switch,
  },
  {
    label: '枚举',
    icon: 'switcher',
    value: map.enumeration,
  },
  {
    label: '列操作',
    icon: 'tool',
    value: map.operations,
  },
]

export default options
