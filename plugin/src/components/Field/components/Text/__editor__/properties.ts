import _ from 'lodash'
import BaseProperty from '~/components/Field/types/baseProperty'

import { Editor, JsonSchema } from '~/types'

export const defaultValueMap = {}

export default (_formData: JsonSchema.DynamicObject): Editor.BaseProperties => {
  return {
    ..._.omit(BaseProperty, [
      'placeholder',
      'required',
      'disabled',
      'onChangeRequests',
      'setFieldValues',
    ]),
  }
}
