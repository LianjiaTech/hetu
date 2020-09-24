/* eslint-disable no-template-curly-in-string */
import QS from 'query-string'
import { Editor, JsonSchema } from '~/types'
import { getProjectFromPath } from '~/utils'

let a = (_formDate: JsonSchema.DynamicObject): Editor.BaseProperties => {
  const { route } = QS.parse(window.location.search)
  const projectCode = getProjectFromPath(route as string)

  return {
    triggerButtonText: {
      title: '按钮文案',
      type: 'string',
      defaultValue: '编辑',
    },
    buttonType: {
      title: '按钮类型',
      type: 'enum',
      enumList: ['default', 'primary', 'dashed', 'danger', 'link'],
      enumDescriptionList: ['default', 'primary', 'dashed', 'danger', 'link'],
      defaultValue: 'primary',
    },
    width: {
      title: '弹框宽度',
      type: 'number',
      defaultValue: 416,
    },
    title: {
      title: '弹框标题',
      type: 'string',
    },
    url: {
      title: '请求地址',
      type: 'string',
      demo: `
      接口格式
      <p class="g-js-row">1. 以项目唯一标识 <span class="g-js-block">/${projectCode}</span> 作为前缀, 使用相对路径</p>
      <p class="g-js-row">2. 可以使用其他项目的唯一标识 </p>
      <p class="g-js-row">3. 打开 <a href="${window.location.origin}/__log__?projectCode=${projectCode}" target="_blank">debug工具</a>调试接口</p>
    `,
      defaultValue: '',
    },
    method: {
      title: '请求方法',
      type: 'enum',
      defaultValue: 'post',
      enumList: ['get', 'post'],
      enumDescriptionList: ['get', 'post'],
    },
    cols: {
      title: '表单项布局',
      desc: '默认为1列布局',
      defaultValue: 1,
      type: 'number',
    },
    top: {
      title: '顶部距离',
      desc: '弹框到页面顶部到距离',
      type: 'number',
      defaultValue: 100,
    },
    alias: {
      title: '表单变量名',
      desc: '用于访问当前表单的值',
      defaultValue: '$$HtModalForm',
      type: 'string',
    },
    buttons: {
      title: '按钮',
      type: 'enum',
      mode: 'multiple',
      defaultValue: ['cancel', 'submit'],
      enumList: ['cancel', 'submit', 'reset'],
      enumDescriptionList: ['取消', '保存', '重置'],
      group: 'default',
    },
    fields: {
      title: '表单项',
      type: 'json',
      defaultValue: [],
      height: 400,
    },
    transform: {
      title: '数据转换',
      desc: '',
      demo: `
      用法示例: <span class="g-js-block"><%:= data => ({...data}) %></span> <br/>
      <p class="g-js-row">1. 最外层 <span class="g-js-block"><%:= %></span> 是模版特殊语法, 里面的内容将作为javascript语法片段执行 </p>
      <p class="g-js-row">2. <span class="g-js-block">data => ({...data})</span> 是 <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arrow_functions" target="_blank">es6箭头函数</a>, 相当于 <span class="g-js-block">function(data){ return {...data} }</span> </p>
      <p class="g-js-row">3. 函数第一个参数 <span class="g-js-block">data</span> 是请求响应值, 函数需要返回处理后的数据</p> `,
      type: 'string',
      defaultValue: '<%:= data => ({ ...data }) %>',
    },
  }
}

export default a
