import { Editor, JsonSchema } from '~/types'
import _ from 'lodash'
import baseProperty from '~/components/Field/types/baseProperty'
export const defaultValueMap = {}

export default (_formData: JsonSchema.DynamicObject): Editor.BaseProperties => {
  return {
    message: {
      title: '提示内容',
      type: 'string',
      defaultValue: '提示内容',
    },
    description: {
      title: '辅助内容',
      type: 'string',
    },
    alertType: {
      title: '提示类型',
      type: 'enum',
      enumList: ['success', 'info', 'warning', 'error'],
      enumDescriptionList: ['success', 'info', 'warning', 'error'],
      defaultValue: 'info',
    },
    style: {
      title: '布局样式',
      type: 'json-inline',
      height: 100,
      defaultValue: {
        marginBottom: '0px',
      },
    },
    showIcon: {
      title: '显示icon',
      type: 'bool',
      defaultValue: false,
    },
    ..._.pick(baseProperty, 'colProps'),
  }
}
