import _ from 'lodash'
import BaseProperty from '~/components/Field/types/baseProperty'
import { Editor } from '~/types'
let a: Editor.BaseProperties = {
  ..._.omit(BaseProperty, ['required', 'disabled']),
  defaultValue: {
    title: '默认值',
    type: 'number',
  },
  min: {
    title: '最小值',
    type: 'number',
  },
  max: {
    title: '最大值',
    type: 'number',
  },
  ..._.pick(BaseProperty, ['required', 'disabled']),
}

export default a
