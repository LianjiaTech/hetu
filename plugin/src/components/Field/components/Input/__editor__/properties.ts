import _ from 'lodash'
import BaseProperty from '~/components/Field/types/baseProperty'
import { rules } from '~/components/Field/types/commonPropsDefine'
import { Editor } from '~/types'

let a: Editor.BaseProperties = {
  ..._.omit(BaseProperty, [
    'required',
    'disabled',
    'onChangeRequests',
    'setFieldValues',
    'triggerOnChanges',
  ]),
  maxLength: {
    title: '最大长度',
    type: 'number',
  },
  ..._.pick(BaseProperty, ['required', 'disabled']),
  rules,
  ..._.pick(BaseProperty, [
    'onChangeRequests',
    'setFieldValues',
    'triggerOnChanges',
  ]),
}

export default a
