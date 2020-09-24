/* eslint-disable no-template-curly-in-string */
import QS from 'query-string'
import { Editor, JsonSchema } from '~/types'
import { getProjectFromPath } from '~/utils'

let a = (_formData: JsonSchema.DynamicObject): Editor.BaseProperties => {
  const { route } = QS.parse(window.location.search)
  const projectCode = getProjectFromPath(route as string)

  return {
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
      enumList: ['get', 'post', 'put', 'patch', 'delete'],
      enumDescriptionList: ['get', 'post', 'put', 'patch', 'delete'],
    },

    alias: {
      title: '表单变量',
      desc: '用于访问当前表单的值',
      defaultValue: '$$HtForm',
      type: 'string',
      group: 'default',
    },
    responseAlias: {
      title: '响应变量',
      desc: '用于访问表单请求响应值的变量名',
      defaultValue: '$$HtFormResponse',
      type: 'string',
      group: 'default',
    },
    buttons: {
      title: '按钮',
      desc: '',
      type: 'enum',
      showTooltip: true,
      mode: 'multiple',
      defaultValue: ['back', 'submit'],
      enumList: ['submit', 'back', 'reset', 'redirectTo', 'download'],
      enumDescriptionList: ['保存', '返回', '重置', '下一步', '下载'],
      group: 'default',
    },
    title: {
      title: '标题',
      desc: '默认为页面标题',
      type: 'string',
    },
    transform: {
      title: '数据转换',
      desc: '',
      showTooltip: false,
      demo: `
        <p class="g-js-row">用法示例: <span class="g-js-block"><%:= data => ({...data}) %></span> </p>
        <p class="g-js-row">1. 最外层 <span class="g-js-block"><%:= %></span> 是模版特殊语法, 里面的内容将作为javascript语法片段执行 </p>
        <p class="g-js-row">2. <span class="g-js-block">data => ({...data})</span> 是 <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arrow_functions" target="_blank">es6箭头函数</a>, 相当于 <span class="g-js-block">function(data){ return {...data} }</span> </p>
        <p class="g-js-row">3. 函数第一个参数 <span class="g-js-block">data</span> 是请求响应值, 函数需要返回处理后的数据</p>
        `,
      doc: '',
      type: 'string',
      defaultValue: '<%:= data => ({...data}) %>',
    },
    _onSuccessAction: {
      title: '请求成功回调',
      desc: '',
      demo:
        '支持以下几种类型: <p class="g-js-row">1. 刷新页面 <span class="g-js-block">["reload"]</span></p><p class="g-js-row">2. 返回上一页 <span class="g-js-block">["goBack"]</span></p><p class="g-js-row">3. 重定向到某页面 <span class="g-js-block">["redirectTo", "https://aaa.com/?id=<%= 123 %>"]</span></p><p class="g-js-row">4. 打开一个新的浏览器窗口 <span class="g-js-block">["openWindow", "https://aaa.com/?id=<%= 123 %>"]</span></p>',
      type: 'json',
      height: 60,
      group: 'default',
    },
    cols: {
      title: '[表单项] 栅栏数',
      desc: '默认为1列布局',
      defaultValue: 1,
      type: 'number',
      group: 'default',
    },
    labelCol: {
      title: '[表单项] 标题布局',
      desc: '在这里统一设置表单项的标题布局',
      type: 'object',
      showTooltip: true,
      properties: {
        span: {
          title: '标题宽度',
          type: 'number',
          defaultValue: 6,
        },
        offset: {
          title: '右移距离',
          type: 'number',
          defaultValue: 0,
        },
      },
      group: 'extend',
    },
    wrapperCol: {
      title: '[表单项] 内容布局',
      desc: '在这里统一设置表单项的内容布局',
      type: 'object',
      showTooltip: true,
      properties: {
        span: {
          title: '标题宽度',
          type: 'number',
          defaultValue: 12,
        },
        offset: {
          title: '右移距离',
          type: 'number',
          defaultValue: 0,
        },
      },
      group: 'extend',
    },
    submitButtonText: {
      title: '[按钮文案] submit',
      type: 'string',
      defaultValue: '保存',
      group: 'extend',
    },
    resetButtonText: {
      title: '[按钮文案] reset',
      type: 'string',
      defaultValue: '重置',
      group: 'extend',
    },
    backButtonText: {
      title: '[按钮文案] back',
      type: 'string',
      defaultValue: '返回',
      group: 'extend',
    },

    buttonGroupProps: {
      title: '[按钮组] 栅格布局',
      type: 'object',
      properties: {
        span: {
          title: '栅格格数',
          desc: '共24列',
          type: 'number',
        },
        offset: {
          title: '左侧间隔格数',
          desc: '0-24之间',
          type: 'number',
        },
        push: {
          title: '右移格数',
          desc: '0-24之间',
          type: 'number',
        },
        pull: {
          title: '左移格数',
          desc: '0-24之间',
          type: 'number',
        },
      },
      group: 'extend',
    },
  }
}

export default a
