/* eslint-disable no-template-curly-in-string */
import { Editor } from '~/types'
import extraOptions from './extra'
import fieldOptions from './fields'

const config: Editor.AdditableProperties = {
  extra: {
    title: '右上角按钮',
    options: extraOptions,
  },
  fields: {
    title: '表单项',
    optionGroups: fieldOptions,
  },
}

export default config
