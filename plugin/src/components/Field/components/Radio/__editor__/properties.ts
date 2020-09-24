/* eslint-disable no-template-curly-in-string */
import _ from 'lodash'
import BaseProperty from '~/components/Field/types/baseProperty'
import {
  labelField,
  valueField,
} from '~/components/Field/types/commonPropsDefine'
import { getDefaultValue } from '~/components/Field/types/interface'
import { Editor, JsonSchema } from '~/types'

export default (formData: JsonSchema.DynamicObject): Editor.BaseProperties => {
  let otherProps: any = {}

  if (formData.optionsSourceType !== 'static') {
    otherProps.labelField = labelField
    otherProps.valueField = valueField
  }

  let result: Editor.BaseProperties = {
    ..._.omit(BaseProperty, 'placeholder'),
    canAddOption: {
      title: '动态添加选项',
      type: 'bool',
      defaultValue: false,
    },
    optionsSourceType: {
      title: '选项数据来源',
      type: 'enum',
      demo:
        '说明: <p class="g-js-row">1. <span class="g-js-block">静态数据</span> </p> <p class="g-js-row">2. <span class="g-js-block">数据中心变量</span> 使用数据中心的变量, 该变量配置在页面顶部JSON配置remote中, 变量对应一个接口的返回值</p>',
      defaultValue: 'static',
      enumList: ['static', 'dependencies'],
      enumDescriptionList: ['静态数据', '数据中心变量'],
    },
    ...otherProps,
  }

  let mergeFormData = _.merge(getDefaultValue(result), formData)

  result.buttonStyle = {
    title: '风格样式',
    type: 'enum',
    defaultValue: '',
    enumList: ['', 'outline', 'solid'],
    enumDescriptionList: ['默认', '描边', '填色'],
  }

  result.options = {
    visible: mergeFormData.optionsSourceType === 'static',
    title: 'options选项',
    type: 'arrayOf',
    defaultValue: [],
    properties: {
      label: {
        title: '显示值',
        type: 'string',
      },
      value: {
        title: '真实值',
        type: 'string',
        demo:
          '不同数据类型的写法: <p class="g-js-row">1. 字符串 <span class="g-js-block">1234</span></p><p class="g-js-row">2. 数字 <span class="g-js-block"><%:= 1234 %></span></p><p class="g-js-row">3. 布尔 <span class="g-js-block"><%:= true %></span></p><p class="g-js-row">注意⚠️: 非字符串类型, 需要用模版变量语法 <span class="g-js-block"><%:= %></span></p>',
      },
    },
  }

  result.optionsDependencies = {
    visible: mergeFormData.optionsSourceType === 'dependencies',
    title: '在remote中的字段',
    type: 'string',
    showTooltip: true,
    desc: '在pagestate中目标数据的路径',
    placeholder: '例如: <%:= obj.list %> ',
    defaultValue: '<%:= %>',
  }

  return result
}
