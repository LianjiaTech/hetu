import { Editor } from '~/types'
import map from './default_value'

const options: Editor.AdditablePropertiesOption[] = [
  {
    label: '页面跳转',
    icon: 'border',
    value: map.HtButton,
  },
  {
    label: '弹框',
    icon: 'alert',
    value: map.HtModalForm,
  },
]

export default options
