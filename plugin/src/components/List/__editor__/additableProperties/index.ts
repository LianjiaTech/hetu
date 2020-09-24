/* eslint-disable no-template-curly-in-string */
import { Editor } from '~/types'
import columnOptions from './columns'
import extraOptions from './extra'
import fieldOptions from './fields'
import sectionOptions from './sections'

const config: Editor.AdditableProperties = {
  extra: {
    title: '右上角按钮',
    options: extraOptions,
  },
  fields: {
    title: '表单项',
    options: fieldOptions,
  },
  columns: {
    title: '表格列',
    options: columnOptions,
  },
  selections: {
    title: '表格批量操作',
    options: sectionOptions,
  },
}

export default config
