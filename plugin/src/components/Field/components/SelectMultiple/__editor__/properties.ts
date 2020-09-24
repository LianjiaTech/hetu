/* eslint-disable no-template-curly-in-string */
import _ from 'lodash'
import QS from 'query-string'
import BaseProperty from '~/components/Field/types/baseProperty'
import {
  labelField,
  valueField,
} from '~/components/Field/types/commonPropsDefine'
import { getDefaultValue } from '~/components/Field/types/interface'
import { Editor, JsonSchema } from '~/types'
import { getProjectFromPath } from '~/utils'

export default (formData: JsonSchema.DynamicObject): Editor.BaseProperties => {
  const { route } = QS.parse(window.location.search)
  const projectCode = getProjectFromPath(route as string)

  let _baseProperty = _.cloneDeep(BaseProperty)
  _baseProperty.defaultValue = {
    title: '默认值',
    desc: '格式为: string[]｜number[] | {label,key}[]',
    type: 'json',
    defaultValue: [],
  }

  let otherProps: any = {}

  if (formData.optionsSourceType !== 'remote') {
    _baseProperty.showSearch = {
      title: '模糊搜索',
      type: 'bool',
      defaultValue: false,
    }

    _baseProperty.isCheckAll = {
      title: '是否全选',
      desc: '开启后可以全选所有选项',
      type: 'bool',
      defaultValue: false,
    }
  }

  if (formData.optionsSourceType !== 'static') {
    otherProps.labelField = labelField
    otherProps.valueField = valueField
  }

  let result: Editor.BaseProperties = {
    ..._baseProperty,
    labelInValue: {
      title: '是否回显',
      desc: '回显时默认值格应式为{label,key}[]',
      type: 'bool',
      defaultValue: false,
    },
    optionsSourceType: {
      title: '选项数据来源',
      desc: '',
      demo:
        '说明: <p class="g-js-row">1. <span class="g-js-block">静态数据</span> 不会变化的数据</p> <p class="g-js-row">2. <span class="g-js-block">数据中心变量</span> 该变量配置在页面顶部JSON配置remote中, 变量对应一个接口的返回值, 通常用于数据可一次性返回的情况</p> <p class="g-js-row">3. <span class="g-js-block">自定义</span> 根据用户输入获取数据, 适用于无法一次性返回所有数据, 需要根据用户输入返回部分数据的情况, 例如搜索在职员工</p>',
      type: 'enum',
      defaultValue: 'static',
      enumList: ['static', 'dependencies', 'remote'],
      enumDescriptionList: ['静态数据', '数据中心变量', '自定义'],
    },
    ...otherProps,
  }

  let mergeFormData = _.merge(getDefaultValue(result), formData)

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
    desc: '在pagestate中目标数据的路径',
    placeholder: '例如: <%:= obj.list  %> ',
    defaultValue: '<%:=  %>',
  }

  result.optionsConfig = {
    visible: mergeFormData.optionsSourceType === 'remote',
    title: '远程options',
    type: 'object',
    properties: {
      url: {
        title: '请求地址',
        type: 'string',
        demo: `
        接口格式
        <p class="g-js-row">1. 以项目唯一标识 <span class="g-js-block">/${projectCode}</span> 作为前缀, 使用相对路径</p>
        <p class="g-js-row">2. 可以使用其他项目的唯一标识 </p>
        <p class="g-js-row">3. 打开 <a href="${window.location.origin}/__log__?projectCode=${projectCode}" target="_blank">debug工具</a>调试接口</p>
      `,
      },
      method: {
        title: '请求方法',
        type: 'enum',
        defaultValue: 'get',
        enumList: ['get', 'post'],
        enumDescriptionList: ['get', 'post'],
      },
      field: {
        title: '搜索字段',
        type: 'string',
        defaultValue: 'keyLike',
      },
      params: {
        title: '默认参数',
        desc: `例如: { a: 1 }`,
        type: 'json',
        defaultValue: '{}',
      },
    },
  }

  result.searchOnFocus = {
    visible: mergeFormData.optionsSourceType === 'remote',
    title: '聚焦搜索',
    type: 'bool',
    defaultValue: false,
  }

  return result
}
