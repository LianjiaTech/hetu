import _ from 'lodash'
import BaseProperty from '~/components/Field/types/baseProperty'
import { Editor, JsonSchema } from '~/types'

export const defaultValueMap = {}

export default (_formData: JsonSchema.DynamicObject): Editor.BaseProperties => {
  return {
    ..._.pick(BaseProperty, ['field', 'title']),
    current: {
      title: 'current',
      desc: '指定当前步骤，从 0 开始记数',
      type: 'number',
      defaultValue: 0,
    },
    initial: {
      title: 'initial',
      desc: '起始序号',
      type: 'number',
      defaultValue: 0,
    },
    // direction: {
    //   title: 'direction',
    //   type: 'enum',
    //   enumList: ['horizontal', 'vertical'],
    //   enumDescriptionList: ['水平', '竖直'],
    //   defaultValue: 'horizontal',
    //   desc: '指定步骤条方向',
    // },
    steps: {
      visible: true,
      title: 'steps配置',
      type: 'arrayOf',
      defaultValue: [
        {
          title: 'First1',
          description: 'First-description',
        },
        {
          title: 'Second',
          description: 'Second-description',
        },
        {
          title: 'Last',
          description: 'Last-description',
        },
      ],
      properties: {
        title: {
          title: 'title',
          type: 'string',
        },
        description: {
          title: 'description',
          type: 'string',
        },
      },
    },
    style: {
      title: '布局样式',
      type: 'json',
      height: 100,
      defaultValue: {
        marginBottom: '0px',
      },
    },
  }
}
