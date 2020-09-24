/* eslint-disable no-template-curly-in-string */
import { Editor } from '~/types'
import fieldOptions from '~/components/Form/__editor__/additableProperties/fields'

const config: Editor.AdditableProperties = {
  fields: {
    title: '表单项',
    optionGroups: fieldOptions,
  },
}

export default config
