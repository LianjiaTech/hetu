import { Editor, JsonSchema } from '~/types'

export const defaultValueMap = {}

export default (_formData: JsonSchema.DynamicObject): Editor.BaseProperties => {
  return {
    alias: {
      title: 'alias',
      desc: '当前步骤变量',
      type: 'string',
      defaultValue: '$$HtStepsActive',
    },
    current: {
      title: '默认步骤',
      desc: '指定当前步骤，从 0 开始记数',
      type: 'number',
      defaultValue: 0,
    },
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
      type: 'json-inline',
      height: 100,
      defaultValue: {
        marginBottom: '0px',
      },
    },
    showButton: {
      title: '展示控制按钮',
      type: 'bool',
      defaultValue: true,
    },
  }
}
