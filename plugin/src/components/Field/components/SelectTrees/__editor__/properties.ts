/* eslint-disable no-template-curly-in-string */
import QS from 'query-string'
import BaseProperty from '~/components/Field/types/baseProperty'
import {
  labelField,
  valueField,
} from '~/components/Field/types/commonPropsDefine'
import { Editor, JsonSchema } from '~/types'
import { getProjectFromPath } from '~/utils'

export const defaultValueMap = {}

export default (formData: JsonSchema.DynamicObject): Editor.BaseProperties => {
  let otherProps: any = {}
  let showCheckedStrategy: any = {}

  const { route } = QS.parse(window.location.search)
  const projectCode = getProjectFromPath(route as string)

  if (formData.treeCheckable) {
    // 如果是多选就显示`数据回显策略`
    showCheckedStrategy = {
      showCheckedStrategy: {
        title: '数据回显策略',
        type: 'enum',
        enumList: ['SHOW_ALL', 'SHOW_PARENT', 'SHOW_CHILD'],
        enumDescriptionList: ['全部', '全选只显示父级', '全选只显示子级'],
        defaultValue: 'SHOW_PARENT',
      },
    }
  }
  otherProps.defaultValue = {
    title: '默认值',
    type: 'json',
    demo: `数据格式为:<p class="g-js-row"><pre class="g-js-block">${JSON.stringify(
      [
        { label: '北京', value: '10000' },
        { label: '上海', value: '20000' },
      ],
      null,
      2
    )}</pre></p><p class="g-js-row"><span class="g-js-block">label</span>和<span class="g-js-block">value</span>字段可修改,对应下文配置的显示字段和提交字段</p>`,
    defaultValue: [],
  }

  let result: Editor.BaseProperties = {
    ...BaseProperty,
    ...otherProps,
    treeCheckable: {
      title: '开启多选',
      type: 'bool',
      defaultValue: false,
    },
    showSearch: {
      title: '开启搜索',
      type: 'bool',
      defaultValue: true,
    },
    ...showCheckedStrategy,
    nodePath: {
      visible: formData.optionsSourceType === 'async',
      title: '节点层级信息',
      type: 'bool',
      enumList: ['是', '否'],
      enumDescriptionList: [true, false],
      defaultValue: true,
    },
    splitTag: {
      visible:
        formData.optionsSourceType === 'async' && formData.nodePath === true,
      title: '层级分割符号',
      type: 'string',
      defaultValue: '>>>',
    },
    labelField,
    valueField,

    optionsSourceType: {
      title: 'option加载方式',
      type: 'enum',
      defaultValue: 'static',
      enumList: ['all', 'async', 'dependencies'],
      enumDescriptionList: ['一次加载', '异步加载', '外部依赖'],
    },
    searchConfigs: {
      visible: formData.optionsSourceType !== 'dependencies',
      title: '级联搜索配置',
      desc:
        '用于配置第一项配置第一级下拉选项;第二项配置第二级下拉选项;...第N项类推',
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
    treeData: {
      visible: formData.optionsSourceType === 'dependencies',
      title: 'option数据源',
      type: 'string',
      desc: '从local、SelectTreesremote、pagestate中变量中获取数据',
      defaultValue: '<%:= %>',
    },
  }

  return result
}
