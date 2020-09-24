import _ from 'lodash'
import BaseProperty from '~/components/Field/types/baseProperty'
import { Editor } from '~/types'

const config: Editor.BaseProperties = {
  ..._.omit(BaseProperty, ['placeholder', 'required', 'disabled']),
  height: {
    title: '高度',
    type: 'number',
    defaultValue: 60,
  },
  required: BaseProperty.required,
  disabled: BaseProperty.disabled,
}

export default config
