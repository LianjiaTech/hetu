import _ from 'lodash'
import baseProperty from '~/components/Field/types/baseProperty'
import { Editor } from '~/types'
const config: Editor.BaseProperties = {
  title: {
    title: '标题',
    type: 'string',
  },
  orientation: {
    title: '标题位置',
    type: 'enum',
    enumList: ['left', 'center', 'right'],
    enumDescriptionList: ['左', '中', '右'],
    defaultValue: 'left',
  },
  ..._.pick(baseProperty, 'colProps'),
}

export default config
