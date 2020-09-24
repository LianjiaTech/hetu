import { Editor } from '~/types'
import map from './default_value'

const options: Editor.AdditablePropertiesOption[] = [
  {
    label: '批量下载',
    icon: 'cloud-download',
    value: map.HtButton,
  },
  {
    label: '批量编辑',
    icon: 'form',
    value: map.HtModalForm,
  },
]

export default options
