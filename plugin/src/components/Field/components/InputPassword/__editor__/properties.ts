import _ from 'lodash'
import BaseProperty from '~/components/Field/types/baseProperty'
import { Editor } from '~/types'

let a: Editor.BaseProperties = {
  ..._.omit(BaseProperty, ['required', 'disabled']),
  maxLength: {
    title: '最大长度',
    type: 'number',
  },
  ..._.pick(BaseProperty, ['required', 'disabled']),
}

export default a
