/* eslint-disable no-template-curly-in-string */
import _ from 'lodash'
import QS from 'query-string'
import BaseProperty from '~/components/Field/types/baseProperty'
import {
  labelField,
  valueField,
} from '~/components/Field/types/commonPropsDefine'
import { Editor, JsonSchema } from '~/types'
import { getProjectFromPath } from '~/utils'
export const defaultValueMap = {}

export default (_formData: JsonSchema.DynamicObject): Editor.BaseProperties => {
  const { route } = QS.parse(window.location.search)
  const projectCode = getProjectFromPath(route as string)

  let _baseProperty = _.cloneDeep(BaseProperty)
  _baseProperty.defaultValue = {
    title: '默认值',
    type: 'json',
    defaultValue: [],
  }

  let result: Editor.BaseProperties = {
    ..._baseProperty,
    showSearch: {
      title: '模糊搜索',
      desc: '模糊搜索和动态加载无法共存',
      type: 'bool',
      defaultValue: false,
    },
    changeOnSelect: {
      title: '选择即改变',
      desc: '打开这个配置, 可以不用选择到最后一级',
      showTooltip: true,
      type: 'bool',
      defaultValue: false,
    },
    labelField,
    valueField,
    options: {
      title: 'options下拉选项',
      demo: `格式说明: <p class="g-js-row"><pre class="g-js-block">${JSON.stringify(
        {
          label: '北京',
          value: 10000,
          children: [{ label: '市辖区', value: 1234 }],
        },
        null,
        2
      )}</pre></p>
      <p><span class="class="g-js-block"">children</span> 为子选项, 是一个数组</p>`,
      type: 'json',
      height: 300,
      defaultValue: [],
    },
    loadDataConfigs: {
      title: '动态加载配置',
      desc: '',
      doc:
        'http://139.155.239.172//components/Field/components/SelectCascade/#components-Field-components-SelectCascade-demo-changeOnSelect',
      type: 'arrayOf',
      defaultValue: [],
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
        searchField: {
          title: '请求字段',
          type: 'string',
          defaultValue: 'key',
        },
        params: {
          title: '请求参数',
          type: 'json',
          defaultValue: {},
        },
        transform: {
          title: '格式转换',
          desc: '',
          demo: `
          <p class="g-js-row">用法示例: <span class="g-js-block"><%:= data => ({...data}) %></span> </p>
          <p class="g-js-row">1. 最外层 <span class="g-js-block"><%:= %></span> 是模版特殊语法, 里面的内容将作为javascript语法片段执行 </p>
          <p class="g-js-row">2. <span class="g-js-block">data => ({...data})</span> 是 <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arrow_functions" target="_blank">es6箭头函数</a>, 相当于 <span class="g-js-block">function(data){ return {...data} }</span> </p>
          <p class="g-js-row">3. 函数第一个参数 <span class="g-js-block">data</span> 是请求响应值, 函数需要返回处理后的数据</p>
          `,
          type: 'string',
          defaultValue: '<%:= data => ({...data}) %>',
        },
      },
    },
  }

  return result
}
